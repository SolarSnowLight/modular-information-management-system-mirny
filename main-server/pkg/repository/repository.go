package repository

import (
	"main-server/pkg/model"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user model.UserRegisterModel) (model.UserAuthDataModel, error)
	LoginUser(user model.UserLoginModel) (model.UserAuthDataModel, error)
	Refresh(refreshToken model.TokenRefreshModel) (model.UserAuthDataModel, error)
	Logout(tokens model.TokenDataModel) (bool, error)

	GetUser(column, value string) (model.UserModel, error)
	GetRole(column, value string) (model.RoleModel, error)
}

type Repository struct {
	Authorization
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
	}
}
