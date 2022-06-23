package repository

import (
	"fmt"
	middlewareConstants "main-server/pkg/constants/middleware"
	tableConstants "main-server/pkg/constants/table"
	articleModel "main-server/pkg/model/article"
	userModel "main-server/pkg/model/user"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type UserPostgres struct {
	db *sqlx.DB
}

/*
* Функция создания экземпляра сервиса
 */
func NewUserPostgres(db *sqlx.DB) *UserPostgres {
	return &UserPostgres{db: db}
}

func (r *UserPostgres) GetUser(column, value interface{}) (userModel.UserModel, error) {
	var user userModel.UserModel
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s=$1", tableConstants.USERS_TABLE, column.(string))

	var err error

	switch value.(type) {
	case int:
		err = r.db.Get(&user, query, value.(int))
		break
	case string:
		err = r.db.Get(&user, query, value.(string))
		break
	}

	return user, err
}

func (r *UserPostgres) CreateArticle(c *gin.Context, title, text string, files []articleModel.FileArticleModel) (bool, error) {
	usersId, _ := c.Get(middlewareConstants.USER_CTX)
	// rolesId, _ := c.Get(middlewareConstants.ROLES_CTX)

	/*var article articleModel.ArticleDBModel

	query := fmt.Sprintf("SELECT * FROM %s WHERE users_id = $1 LIMIT 1", tableConstants.ARTICLES_TABLE)

	err := r.db.Get(&article, query, usersId)
	if err != nil {
		return false, err
	}

	if article*/

	/* Перед обработкой запроса уместно задействовать движок по проверке доступа */
	tx, err := r.db.Begin()
	if err != nil {
		return false, err
	}

	// Добавление информации о статье
	query := fmt.Sprintf("INSERT INTO %s (users_id, title, text) values ($1, $2, $3) RETURNING id", tableConstants.ARTICLES_TABLE)
	var articleId int

	row := tx.QueryRow(query, usersId, title, text)
	if err := row.Scan(&articleId); err != nil {
		tx.Rollback()
		return false, err
	}

	// Добавление информации о файлах
	query = fmt.Sprintf("INSERT INTO %s (filename, filepath) values ($1, $2) RETURNING id", tableConstants.FILES_TABLE)
	var filesId []articleModel.FileArticleExModel

	for _, element := range files {
		var fileId int
		row := tx.QueryRow(query, element.Filename, element.Filepath)
		if err := row.Scan(&fileId); err != nil {
			tx.Rollback()
			return false, err
		}

		filesId = append(filesId, articleModel.FileArticleExModel{
			Filename: element.Filename,
			Filepath: element.Filepath,
			Index:    element.Index,
			Id:       fileId,
		})
	}

	// Добавление информации о файлах и статьях
	query = fmt.Sprintf("INSERT INTO %s (articles_id, files_id, index) values ($1, $2, $3)", tableConstants.ARTICLES_FILES_TABLE)

	for _, element := range filesId {
		_, err = tx.Exec(query, articleId, element.Id, element.Index)
		if err != nil {
			tx.Rollback()
			return false, err
		}
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		return false, err
	}

	return true, nil
}

func (r *UserPostgres) GetArticle(c *gin.Context) (articleModel.ArticleResponse, error) {
	usersId, _ := c.Get(middlewareConstants.USER_CTX)

	var article articleModel.ArticleDBModel

	query := fmt.Sprintf("SELECT * FROM %s WHERE users_id = $1 LIMIT 1", tableConstants.ARTICLES_TABLE)

	err := r.db.Get(&article, query, usersId)
	if err != nil {
		return articleModel.ArticleResponse{}, err
	}

	var articlesFiles []articleModel.ArticlesFilesDBModel

	query = fmt.Sprintf(`SELECT index, filename, filepath FROM %s JOIN %s ON %s.files_id = %s.id;`,
		tableConstants.ARTICLES_FILES_TABLE, tableConstants.FILES_TABLE,
		tableConstants.ARTICLES_FILES_TABLE, tableConstants.FILES_TABLE)

	if err := r.db.QueryRow(query).Scan(pq.Array(&articlesFiles)); err != nil {
		return articleModel.ArticleResponse{}, err
	}

	var articlesFilesEx []articleModel.FileArticleModel
	for _, element := range articlesFiles {
		articlesFilesEx = append(articlesFilesEx, articleModel.FileArticleModel{
			Index:    element.Index,
			Filename: element.Filename,
			Filepath: element.Filepath,
		})
	}

	return articleModel.ArticleResponse{
		Id:    article.Id,
		Title: article.Title,
		Text:  article.Title,
		Files: articlesFilesEx,
	}, nil
}
