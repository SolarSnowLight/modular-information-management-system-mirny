package service

import (
	"errors"
	"main-server/pkg/model"
	"main-server/pkg/repository"

	"github.com/dgrijalva/jwt-go"
)

// Структура определяющая данные токена
type tokenClaims struct {
	jwt.StandardClaims
	UsersId string `json:"users_id"`
	RolesId string `json:"roles_id"`
}

// Структура репозитория
type AuthService struct {
	repo repository.Authorization
}

// Функция создания нового репозитория
func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

/*
*	Create user
 */
func (s *AuthService) CreateUser(user model.UserRegisterModel) (model.UserAuthDataModel, error) {
	return s.repo.CreateUser(user)
}

/*
*	Login user
 */
func (s *AuthService) LoginUser(user model.UserLoginModel) (model.UserAuthDataModel, error) {
	return s.repo.LoginUser(user)
}

/*
*	Refresh user
 */
func (s *AuthService) Refresh(refreshToken model.TokenRefreshModel) (model.UserAuthDataModel, error) {
	return s.repo.Refresh(refreshToken)
}

/*
*	Logout user
 */
func (s *AuthService) Logout(tokens model.TokenDataModel) (bool, error) {
	return s.repo.Logout(tokens)
}

/*
*	Token parsing function
 */
func (s *AuthService) ParseToken(pToken, signingKey string) (model.TokenOutputParse, error) {
	token, err := jwt.ParseWithClaims(pToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})

	if !token.Valid {
		return model.TokenOutputParse{}, errors.New("token is not valid")
	}

	if err != nil {
		return model.TokenOutputParse{}, err
	}

	// Получение данных из токена (с преобразованием к указателю на tokenClaims)
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return model.TokenOutputParse{}, errors.New("token claims are not of type")
	}

	user, err := s.repo.GetUser("uuid", claims.UsersId)

	if err != nil {
		return model.TokenOutputParse{}, err
	}

	role, err := s.repo.GetRole("uuid", claims.RolesId)

	if err != nil {
		return model.TokenOutputParse{}, err
	}

	return model.TokenOutputParse{
		UsersId: user.Id,
		RolesId: role.Id,
	}, nil
}
