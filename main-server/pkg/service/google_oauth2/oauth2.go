package google_oauth2

import (
	"context"
	"encoding/json"
	"main-server/configs"
	"main-server/pkg/constants/route"
	userModel "main-server/pkg/model/user"
	"net/http"

	"golang.org/x/oauth2"
)

type VerifyEmailModel struct {
	VerifyEmail bool `json:"verified_email" binding:"required"`
}

func RefreshAccessToken(c context.Context, token *oauth2.Token) (*oauth2.Token, error) {
	tokenSource := configs.AppOAuth2Config.GoogleLogin.TokenSource(c, token)
	newToken, err := tokenSource.Token()

	if err != nil {
		return nil, err
	}

	if newToken.AccessToken != token.AccessToken {
		return newToken, nil
	}

	return token, nil
}

func VerifyAccessToken(accessToken string) (bool, error) {
	response, err := http.Get(route.OAUTH2_TOKEN_INFO_ROUTE + accessToken)

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

func RevokeToken(accessToken string) (bool, error) {
	response, err := http.Post(
		route.OAUTH2_REVOKE_TOKEN_ROUTE+accessToken,
		"Content-type:application/x-www-form-urlencoded",
		nil)

	if err != nil {
		return false, err
	}

	return (response.StatusCode == 200), nil
}
