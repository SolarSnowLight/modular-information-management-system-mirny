package handler

import (
	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

// @Summary SignUp
// @Tags auth
// @Description Регистрация пользователя
// @ID create-account
// @Accept  json
// @Produce  json
// @Param input body userModel.UserRegisterModel true "account info"
// @Success 200 {object} userModel.TokenAccessModel "data"
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /auth/sign-up [post]
func (h *Handler) createArticle(c *gin.Context) {
	form, _ := c.MultipartForm()
	files := form.File["files"]
	// text := c.PostForm("text")

	for _, file := range files {
		c.SaveUploadedFile(file, "./public/"+uuid.NewV4().String())
	}

	//c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
}
