package service

import (
	articleModel "main-server/pkg/model/article"
	"main-server/pkg/repository"

	"github.com/gin-gonic/gin"
)

// Структура репозитория
type UserService struct {
	repo repository.User
}

// Функция создания нового репозитория
func NewUserService(repo repository.User) *UserService {
	return &UserService{
		repo: repo,
	}
}

/*
*	Create article
 */
func (s *UserService) CreateArticle(c *gin.Context, title, text string, files []articleModel.FileArticleModel) (bool, error) {
	return s.repo.CreateArticle(c, title, text, files)
}

/*
*	Get article
 */

func (s *UserService) GetArticle(c *gin.Context) (articleModel.ArticleResponse, error) {
	return s.repo.GetArticle(c)
}
