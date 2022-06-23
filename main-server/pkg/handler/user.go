package handler

import (
	"fmt"
	articleModel "main-server/pkg/model/article"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

// @Summary CreateArticle
// @Tags create_article
// @Description Создание статьи
// @ID create-article
// @Accept  json
// @Produce  json
// @Success 200 {object} articleModel.ArticleCreateResponse "data"
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /user/article/create [post]
func (h *Handler) createArticle(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	files := form.File["files"]
	text := c.PostForm("text")
	var arrayFiles []articleModel.FileArticleModel

	for _, file := range files {
		filepath := "public/" + uuid.NewV4().String()
		index, err := strconv.Atoi(file.Filename)

		if err != nil {
			newErrorResponse(c, http.StatusInternalServerError, err.Error())
			return
		}

		arrayFiles = append(arrayFiles, articleModel.FileArticleModel{
			Filename: file.Filename,
			Filepath: filepath,
			Index:    index,
		})
		c.SaveUploadedFile(file, filepath)
	}

	data, err := h.services.User.CreateArticle(c, " ", text, arrayFiles)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, articleModel.ArticleCreateResponse{
		IsCreated: data,
	})
}

// @Summary GetArticle
// @Tags get_article
// @Description Получение статьи
// @ID get-article
// @Accept  json
// @Produce  json
// @Success 200 {object} articleModel.ArticleCreateResponse "data"
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /user/article/get [post]
func (h *Handler) getArticle(c *gin.Context) {
	data, err := h.services.User.GetArticle(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	fmt.Print(data.Text)

	c.JSON(http.StatusOK, data)
}
