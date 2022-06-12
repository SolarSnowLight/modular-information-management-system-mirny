package google_oauth2

import (
	"encoding/json"
	"main-server/pkg/constants/route"
	userModel "main-server/pkg/model/user"
	"net/http"

	"golang.org/x/oauth2"
)

type VerifyEmailModel struct {
	VerifyEmail bool `json:"verified_email" binding:"required"`
}

func VerifyAccessToken(token *oauth2.Token) (bool, error) {
	response, err := http.Get(route.OAUTH2_TOKEN_INFO_ROUTE + token.AccessToken)

	var j VerifyEmailModel

	err = json.NewDecoder(response.Body).Decode(&j)

	if err != nil {
		return false, err
	}

	return j.VerifyEmail, nil
}

func GetUserInfo(token *oauth2.Token) (userModel.UserRegisterOAuth2Model, error) {
	response, err := http.Get(route.OAUTH2_USER_INFO_ROUTE + token.AccessToken)

	var data userModel.UserRegisterOAuth2Model

	err = json.NewDecoder(response.Body).Decode(&data)

	if err != nil {
		return userModel.UserRegisterOAuth2Model{}, err
	}

	return data, nil
}
