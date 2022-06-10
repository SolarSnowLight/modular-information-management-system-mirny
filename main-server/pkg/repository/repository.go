package repository

import (
	rbacModel "main-server/pkg/model/rbac"
	userModel "main-server/pkg/model/user"

	"github.com/jmoiron/sqlx"
)

type Authorization interface {
	CreateUser(user userModel.UserRegisterModel) (userModel.UserAuthDataModel, error)
	LoginUser(user userModel.UserLoginModel) (userModel.UserAuthDataModel, error)
	Refresh(refreshToken userModel.TokenRefreshModel) (userModel.UserAuthDataModel, error)
	Logout(tokens userModel.TokenDataModel) (bool, error)
	Activate(link string) (bool, error)

	GetUser(column, value string) (userModel.UserModel, error)
	GetRole(column, value string) (rbacModel.RoleModel, error)
}

type Repository struct {
	Authorization
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
	}
}
