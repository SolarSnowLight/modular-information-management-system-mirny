package repository

import (
	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"main-server/configs"
	authConstants "main-server/pkg/constants/auth"
	tableConstants "main-server/pkg/constants/table"
	"main-server/pkg/model/email"
	rbacModel "main-server/pkg/model/rbac"
	"main-server/pkg/model/user"
	userModel "main-server/pkg/model/user"
	"main-server/pkg/service/google_oauth2"
	smtpService "main-server/pkg/service/smtp"

	"github.com/dgrijalva/jwt-go"
	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
)

type AuthPostgres struct {
	db *sqlx.DB
}

/*
* Функция создания экземпляра сервиса
 */
func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

/*
* Функция регистрации пользователя
 */
func (r *AuthPostgres) CreateUser(user userModel.UserRegisterModel) (userModel.UserAuthDataModel, error) {
	check := CheckRowExists(r.db, tableConstants.USERS_TABLE, "email", user.Email)

	if check {
		return userModel.UserAuthDataModel{}, errors.New("Пользователь с данным email-адресом уже существует!")
	}

	// Начало транзакции
	tx, err := r.db.Begin()
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	// Хэширование пароля
	// user.Password = generatePasswordHash(user.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), viper.GetInt("crypt.cost"))
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	user.Password = string(hashedPassword)

	var id int
	var userUuid string

	// Запрос на добавление нового пользователя в систему
	query := fmt.Sprintf("INSERT INTO %s (email, password, uuid) values ($1, $2, $3) RETURNING id, uuid", tableConstants.USERS_TABLE)

	// Генерация UUID
	u1 := uuid.NewV4()

	row := tx.QueryRow(query, user.Email, user.Password, u1)
	if err := row.Scan(&id, &userUuid); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Пользователь с данными регистрационными данными уже существует!")
	}

	// Запрос на добавление пользовательских данных
	query = fmt.Sprintf(
		`INSERT INTO %s (data, date_registration, users_id) 
		values ($1, $2, $3)`,
		tableConstants.USERS_DATA_TABLE)

	userJsonb, err := json.Marshal(user.Data)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	_, err = tx.Exec(query, userJsonb, time.Now(), id)

	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf("SELECT * FROM %s WHERE value = $1 LIMIT 1", tableConstants.ROLES_TABLE)
	var role rbacModel.RoleModel
	err = r.db.Get(&role, query, "USER")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Роли пользователя не существует!")
	}

	// Добавление роли пользователю (по-умолчанию данная роль - USER)
	query = fmt.Sprintf("INSERT INTO %s (users_id, roles_id) VALUES ($1, $2)", tableConstants.USERS_ROLES_TABLE)
	_, err = tx.Exec(query, id, role.Id)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	/* Установка типа аутентификации пользователя (в данном случае - LOCAL) */
	var authTypes userModel.AuthTypeModel
	query = fmt.Sprintf("SELECT * FROM %s WHERE value=$1", tableConstants.AUTH_TYPES_TABLE)
	err = r.db.Get(&authTypes, query, "LOCAL")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New(err.Error())
	}

	query = fmt.Sprintf("INSERT INTO %s (users_id, auth_types_id) values ($1, $2)", tableConstants.USERS_AUTH_TYPES_TABLE)
	_, err = tx.Exec(query, id, authTypes.Id)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Генерация токенов доступа и обновления
	accessToken, err := GenerateToken(userUuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_ACCESS, viper.GetString("token.signing_key_access"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	refreshToken, err := GenerateToken(userUuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_REFRESH, viper.GetString("token.signing_key_refresh"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Установка токенов пользователю
	query = fmt.Sprintf("INSERT INTO %s (users_id, access_token, refresh_token) values ($1, $2, $3)", tableConstants.TOKENS_TABLE)
	_, err = tx.Exec(query, id, accessToken, refreshToken)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	/* Добавление ссылки на активацию аккаунта */
	// Генерация UUID
	u2 := uuid.NewV4()
	query = fmt.Sprintf("INSERT INTO %s (users_id, is_activated, activation_link) values ($1, $2, $3)", tableConstants.ACTIVATIONS_TABLE)
	_, err = tx.Exec(query, id, false, u2)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	/*auth := smtp.PlainAuth("", viper.GetString("smtp.email"), os.Getenv("SMTP_PASSWORD"), viper.GetString("smtp.host"))

	err = smtp.SendMail(viper.GetString("smtp.host")+":"+viper.GetString("smtp.port"), auth,
		viper.GetString("smtp.email"), []string{user.Email}, []byte(`<p>Hello, world!</p>`))*/

	err = smtpService.SendMessage(user.Email, smtpService.BuildMessage(email.Mail{
		Sender:  viper.GetString("smtp.email"),
		To:      []string{user.Email},
		Subject: "Подтверждение аккаунта \"МИСУ Мирный\"",
		Body: fmt.Sprintf(`<html>
		<head>
			<meta charset="utf-8" />
			<title></title>
		</head>
		<style>
			body {background-color: #FEFEF9;}
			h2   {color: #181511;}
			button {
				color: rgb(0, 0, 0);
				outline: none;
				border: none;
				border-radius: 30px;
				background-color: #B19472;
				padding: 8px 16px;
				margin-top: 16px;
				cursor: pointer;
			}
		</style>
		<body>
			<h2>Подтверждение E-mail</h2>
			<br><text>Вы получили это письмо, так как Ваш почтовый адрес был указан в приложении "МИСУ Мирный".</text> 
			</br><text>Чтобы подтвердить Вашу почту перейдите по ссылке: </text></br>
			<a href="%s">
			<button>Подтвердить E-mail</button>
			</a>
			<br><br><br>
			<text>Если Вы не проходили процедуру регистрации в приложении "МИСУ Мирный", то не отвечайте на данное сообщение.</text>
		</body>
	</html>`, viper.GetString("api_url")+"/auth/activate/"+u2.String()),
	}))

	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	return userModel.UserAuthDataModel{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, tx.Commit()
}

/*
* Функция авторизации пользователя
 */
func (r *AuthPostgres) LoginUser(user userModel.UserLoginModel) (userModel.UserAuthDataModel, error) {
	var findUser userModel.UserModel
	query := fmt.Sprintf("SELECT * FROM %s tl WHERE tl.email = $1", tableConstants.USERS_TABLE)
	if err := r.db.Get(&findUser, query, user.Email); err != nil {
		return userModel.UserAuthDataModel{}, errors.New("Пользователя с данным почтовым адресом не существует!")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(findUser.Password), []byte(user.Password)); err != nil {
		return userModel.UserAuthDataModel{}, errors.New("Не правильный пароль! Повторите попытку")
	}

	tx, err := r.db.Begin()
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf("DELETE FROM %s tl WHERE tl.users_id = $1", tableConstants.TOKENS_TABLE)
	if _, err := r.db.Exec(query, findUser.Id); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf(`SELECT roles.id, roles.uuid, roles.value, roles.description, roles.users_id FROM %s 
			INNER JOIN %s on users_roles.roles_id = roles.id WHERE users_roles.users_id = $1`, tableConstants.USERS_ROLES_TABLE, tableConstants.ROLES_TABLE)

	var role rbacModel.RoleModel
	if err := r.db.Get(&role, query, findUser.Id); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Пользователь не имеет роли!")
	}

	/* Получение типа аутентификации (в данном случае - LOCAL) */
	var authTypes userModel.AuthTypeModel
	query = fmt.Sprintf("SELECT * FROM %s WHERE value=$1", tableConstants.AUTH_TYPES_TABLE)
	err = r.db.Get(&authTypes, query, "LOCAL")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New(err.Error())
	}

	// Генерация токенов доступа и обновления
	accessToken, err := GenerateToken(findUser.Uuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_ACCESS, viper.GetString("token.signing_key_access"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	refreshToken, err := GenerateToken(findUser.Uuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_REFRESH, viper.GetString("token.signing_key_refresh"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Установка токенов пользователю
	query = fmt.Sprintf("INSERT INTO %s (users_id, access_token, refresh_token) values ($1, $2, $3)", tableConstants.TOKENS_TABLE)
	_, err = tx.Exec(query, findUser.Id, accessToken, refreshToken)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	return userModel.UserAuthDataModel{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, tx.Commit()
}

/*
* Создание пользователя через OAuth2
 */
func (r *AuthPostgres) CreateUserOAuth2(user user.UserRegisterOAuth2Model, token *oauth2.Token) (userModel.UserAuthDataModel, error) {

	check := CheckRowExists(r.db, tableConstants.USERS_TABLE, "email", user.Email)

	if check {
		return userModel.UserAuthDataModel{}, errors.New("Пользователь с данным email-адресом уже существует!")
	}

	// Начало транзакции
	tx, err := r.db.Begin()
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	// Хэширование пароля
	// user.Password = generatePasswordHash(user.Password)
	/*hashedPassword, err := bcrypt.GenerateFromPassword([]byte(token.AccessToken), viper.GetInt("crypt.cost"))
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}*/

	var id int
	var userUuid string

	// Запрос на добавление нового пользователя в систему
	query := fmt.Sprintf("INSERT INTO %s (email, password, uuid) values ($1, $2, $3) RETURNING id, uuid", tableConstants.USERS_TABLE)

	// Генерация UUID
	u1 := uuid.NewV4()

	row := tx.QueryRow(query, user.Email, token.AccessToken, u1)
	if err := row.Scan(&id, &userUuid); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Пользователь с данными регистрационными данными уже существует!")
	}

	// Запрос на добавление пользовательских данных
	query = fmt.Sprintf(
		`INSERT INTO %s (data, date_registration, users_id) 
		values ($1, $2, $3)`,
		tableConstants.USERS_DATA_TABLE)

	userJsonb, err := json.Marshal(userModel.UserJSONBModel{
		Name:     user.Name,
		Surname:  user.FamilyName,
		Nickname: user.GivenName,
	})

	_, err = tx.Exec(query, userJsonb, time.Now(), id)

	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf("SELECT * FROM %s WHERE value = $1 LIMIT 1", tableConstants.ROLES_TABLE)
	var role rbacModel.RoleModel
	err = r.db.Get(&role, query, "USER")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Роли пользователя не существует!")
	}

	// Добавление роли пользователю (по-умолчанию данная роль - USER)
	query = fmt.Sprintf("INSERT INTO %s (users_id, roles_id) VALUES ($1, $2)", tableConstants.USERS_ROLES_TABLE)
	_, err = tx.Exec(query, id, role.Id)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Установка типа аутентификации пользователя (в данном случае - GOOGLE)
	var authTypes userModel.AuthTypeModel
	query = fmt.Sprintf("SELECT * FROM %s WHERE value=$1", tableConstants.AUTH_TYPES_TABLE)
	err = r.db.Get(&authTypes, query, "GOOGLE")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New(err.Error())
	}

	query = fmt.Sprintf("INSERT INTO %s (users_id, auth_types_id) values ($1, $2)", tableConstants.USERS_AUTH_TYPES_TABLE)
	_, err = tx.Exec(query, id, authTypes.Id)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Генерация токенов доступа и обновления
	accessToken, err := GenerateToken(userUuid, role.Uuid, authTypes.Uuid, &token.AccessToken, authConstants.TOKEN_TLL_ACCESS, viper.GetString("token.signing_key_access"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Установка токенов пользователю
	query = fmt.Sprintf("INSERT INTO %s (users_id, access_token, refresh_token) values ($1, $2, $3)", tableConstants.TOKENS_TABLE)
	_, err = tx.Exec(query, id, accessToken, token.RefreshToken)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Добавление ссылки на активацию аккаунта
	// Генерация UUID
	u2 := uuid.NewV4()
	query = fmt.Sprintf("INSERT INTO %s (users_id, is_activated, activation_link) values ($1, $2, $3)", tableConstants.ACTIVATIONS_TABLE)
	_, err = tx.Exec(query, id, true, u2)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	return userModel.UserAuthDataModel{
		AccessToken:  accessToken,
		RefreshToken: token.RefreshToken,
	}, tx.Commit()
}

/*
* Функция авторизации пользователя через Google OAuth2
 */
func (r *AuthPostgres) LoginUserOAuth2(code string) (userModel.UserAuthDataModel, error) {
	token, err := configs.AppOAuth2Config.GoogleLogin.Exchange(oauth2.NoContext, code)

	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	is_verify, err := google_oauth2.VerifyAccessToken(token.AccessToken)

	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	if !is_verify {
		return userModel.UserAuthDataModel{}, errors.New("Данный токен не принадлежит данному пользователю!")
	}

	var findUser userModel.UserModel
	var userData userModel.UserRegisterOAuth2Model

	userData, err = google_oauth2.GetUserInfo(token)

	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	query := fmt.Sprintf("SELECT * FROM %s tl WHERE tl.email = $1", tableConstants.USERS_TABLE)
	if err := r.db.Get(&findUser, query, userData.Email); err != nil {
		// Если пользователя не существует - создаём его
		return r.CreateUserOAuth2(userData, token)
	}

	tx, err := r.db.Begin()
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	/*hashedPassword, err := bcrypt.GenerateFromPassword([]byte(token.AccessToken), viper.GetInt("crypt.cost"))
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}*/

	// Запрос на обновление пароля в базе данных для пользователя
	query = fmt.Sprintf("UPDATE %s SET password=$1 WHERE email=$2", tableConstants.USERS_TABLE)

	if _, err := r.db.Exec(query, token.AccessToken, userData.Email); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf("DELETE FROM %s tl WHERE tl.users_id = $1", tableConstants.TOKENS_TABLE)
	if _, err := r.db.Exec(query, findUser.Id); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	query = fmt.Sprintf(`SELECT roles.id, roles.uuid, roles.value, roles.description, roles.users_id FROM %s
			INNER JOIN %s on users_roles.roles_id = roles.id WHERE users_roles.users_id = $1`, tableConstants.USERS_ROLES_TABLE, tableConstants.ROLES_TABLE)

	var role rbacModel.RoleModel
	if err := r.db.Get(&role, query, findUser.Id); err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New("Пользователь не имеет роли!")
	}

	// Получение типа аутентификации (в данном случае - GOOGLE)
	var authTypes userModel.AuthTypeModel
	query = fmt.Sprintf("SELECT * FROM %s WHERE value=$1", tableConstants.AUTH_TYPES_TABLE)
	err = r.db.Get(&authTypes, query, "GOOGLE")
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, errors.New(err.Error())
	}

	// Генерация токена доступа (локального)
	accessToken, err := GenerateToken(findUser.Uuid, role.Uuid, authTypes.Uuid, &token.AccessToken, authConstants.TOKEN_TLL_ACCESS, viper.GetString("token.signing_key_access"))
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	// Установка токенов пользователю
	query = fmt.Sprintf("INSERT INTO %s (users_id, access_token, refresh_token) values ($1, $2, $3)", tableConstants.TOKENS_TABLE)
	_, err = tx.Exec(query, findUser.Id, accessToken, token.RefreshToken)
	if err != nil {
		tx.Rollback()
		return userModel.UserAuthDataModel{}, err
	}

	return userModel.UserAuthDataModel{
		AccessToken:  accessToken,
		RefreshToken: token.RefreshToken,
	}, tx.Commit()
}

/*
* Функция обновления токена доступа
 */
func (r *AuthPostgres) Refresh(refreshToken string) (userModel.UserAuthDataModel, error) {
	return userModel.UserAuthDataModel{}, nil
	/*userData, err := ParseTokenWithoutValid(token.RefreshToken, viper.GetString("token.signing_key_refresh"))
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	user, err := r.GetUser("uuid", userData.UsersId)
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	var findToken userModel.TokenModel
	query := fmt.Sprintf("SELECT * FROM %s tl WHERE tl.refresh_token = $1 AND tl.users_id = $2", tableConstants.TOKENS_TABLE)

	if err := r.db.Get(&findToken, query, token.RefreshToken, user.Id); err != nil {
		return userModel.UserAuthDataModel{}, errors.New("Пользователя с данным токеном обновления не существует!")
	}

	query = fmt.Sprintf(`SELECT roles.id, roles.uuid, roles.value, roles.description, roles.users_id FROM %s
			INNER JOIN %s on users_roles.roles_id = roles.id WHERE users_roles.users_id = $1`, tableConstants.USERS_ROLES_TABLE, tableConstants.ROLES_TABLE)

	var role rbacModel.RoleModel
	if err := r.db.Get(&role, query, user.Id); err != nil {
		return userModel.UserAuthDataModel{}, errors.New("Пользователь не имеет роли!")
	}

	isValid := ValidToken(token.RefreshToken, viper.GetString("token.signing_key_refresh"))

	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	var refreshToken string

	// Получение типа аутентификации (в данном случае - LOCAL)
	var authTypes userModel.AuthTypeModel
	query = fmt.Sprintf("SELECT * FROM %s WHERE value=$1", tableConstants.AUTH_TYPES_TABLE)
	err = r.db.Get(&authTypes, query, "LOCAL")
	if err != nil {
		return userModel.UserAuthDataModel{}, errors.New(err.Error())
	}

	if !isValid {
		refreshToken, err = GenerateToken(user.Uuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_REFRESH, viper.GetString("token.signing_key_refresh"))
		if err != nil {
			return userModel.UserAuthDataModel{}, err
		}

		setValues = append(setValues, fmt.Sprintf("refresh_token=$%d", argId))
		args = append(args, refreshToken)
		argId++
	} else {
		refreshToken = token.RefreshToken
	}

	accessToken, err := GenerateToken(user.Uuid, role.Uuid, authTypes.Uuid, nil, authConstants.TOKEN_TLL_ACCESS, viper.GetString("token.signing_key_access"))
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	setValues = append(setValues, fmt.Sprintf("access_token=$%d", argId))
	args = append(args, accessToken)
	argId++

	setQuery := strings.Join(setValues, ", ")

	query = fmt.Sprintf("UPDATE %s tl SET %s WHERE tl.users_id = $%d",
		tableConstants.TOKENS_TABLE, setQuery, argId)
	args = append(args, user.Id)

	// Обновление данных о токене пользователя
	_, err = r.db.Exec(query, args...)
	if err != nil {
		return userModel.UserAuthDataModel{}, err
	}

	// Возвращение авторизационных данных пользователя
	return userModel.UserAuthDataModel{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil*/
}

/*
*	Функция подтверждения аккаунта
 */
func (r *AuthPostgres) Activate(link string) (bool, error) {
	var findActivate userModel.UserActivateModel
	query := fmt.Sprintf("SELECT activation_link, is_activated FROM %s WHERE activation_link = $1", tableConstants.ACTIVATIONS_TABLE)

	if err := r.db.Get(&findActivate, query, link); err != nil {
		return false, errors.New(err.Error())
	}

	if findActivate.IsActivated {
		return true, nil
	}

	query = fmt.Sprintf("UPDATE %s SET is_activated=%s WHERE activation_link = $1", tableConstants.ACTIVATIONS_TABLE, "true")

	_, err := r.db.Exec(query, link)

	if err != nil {
		return false, err
	}

	return true, nil
}

/*
* Функция разлогирования пользователя
 */
func (r *AuthPostgres) Logout(data userModel.TokenLogoutDataModel) (bool, error) {
	// Выход из аккаунта зависит от метода аутентификации (предварительная проверка обязательна)
	switch data.AuthTypeValue {
	case "GOOGLE":
		google_oauth2.RevokeToken(*data.TokenApi)
	}

	query := fmt.Sprintf("DELETE FROM %s tl WHERE tl.access_token=$1 AND tl.refresh_token=$2 RETURNING id", tableConstants.TOKENS_TABLE)
	row := r.db.QueryRow(query, data.AccessToken, data.RefreshToken)

	var id int
	if err := row.Scan(&id); err != nil {
		return false, err
	}

	return true, nil
}

/*
* Функция получения данных о пользователе
 */
func (r *AuthPostgres) GetUser(column, value string) (userModel.UserModel, error) {
	var user userModel.UserModel
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s=$1", tableConstants.USERS_TABLE, column)

	err := r.db.Get(&user, query, value)

	return user, err
}

/*
* Функция получения данных о роли
 */
func (r *AuthPostgres) GetRole(column, value string) (rbacModel.RoleModel, error) {
	var user rbacModel.RoleModel
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s=$1", tableConstants.ROLES_TABLE, column)

	err := r.db.Get(&user, query, value)

	return user, err
}

/*
* Функция хэширования пароля
 */
func generatePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(viper.GetString("crypt.salt"))))
}

/* Структура тела токена */
type tokenClaims struct {
	jwt.StandardClaims
	UsersId     string  `json:"users_id"`      // ID пользователя
	RolesId     string  `json:"roles_id"`      // Роль пользователя
	AuthTypesId string  `json:"auth_types_id"` // Тип аутентификации пользователя
	TokenApi    *string `json:"token_api"`     // Внешний токен доступа
}

/*
* Функция генерации токена
 */
func GenerateToken(uuid, rolesUuid, authTypesUuid string, tokenApi *string, tokenTTL time.Duration, signingKey string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		uuid,
		rolesUuid,
		authTypesUuid,
		tokenApi,
	})

	return token.SignedString([]byte(signingKey))
}

/*
* Функция получения данных из токена без проверки на валидацию
 */
func ParseTokenWithoutValid(pToken, signingKey string) (userModel.TokenOutputParseString, error) {
	token, _ := jwt.ParseWithClaims(pToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})

	// Получение данных из токена (с преобразованием к указателю на tokenClaims)
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return userModel.TokenOutputParseString{}, errors.New("token claims are not of type")
	}

	return userModel.TokenOutputParseString{
		UsersId: claims.UsersId,
		RolesId: claims.RolesId,
	}, nil
}

/*
* Функция проверки валидности токена
 */
func ValidToken(pToken, signingKey string) bool {
	_, err := jwt.ParseWithClaims(pToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})

	if err != nil {
		return false
	}

	return true
}
