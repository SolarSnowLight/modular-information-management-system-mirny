package service

import (
	userModel "main-server/pkg/model/user"
	"main-server/pkg/repository"

	"golang.org/x/oauth2"
)

type Authorization interface {
	CreateUser(user userModel.UserRegisterModel) (userModel.UserAuthDataModel, error)
	LoginUser(user userModel.UserLoginModel) (userModel.UserAuthDataModel, error)
	LoginUserOAuth2(token *oauth2.Token) (userModel.UserAuthDataModel, error)
	Refresh(token userModel.TokenRefreshModel) (userModel.UserAuthDataModel, error)
	Logout(tokens userModel.TokenDataModel) (bool, error)
	Activate(link string) (bool, error)

	/*GenerateToken(email string, timeTTL time.Duration) (string, error)
	GenerateTokenWithUuid(uuid string, timeTTL time.Duration) (string, error)*/
	ParseToken(token, signingKey string) (userModel.TokenOutputParse, error)
}

type Service struct {
	Authorization
}

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
	}
}
