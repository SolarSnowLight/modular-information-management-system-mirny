package user

type AuthTypeModel struct {
	Id    int    `json:"id" db:"id"`
	Value string `json:"value" db:"value"`
	Uuid  string `jsin:"uuid" db:"uuid"`
}

type UserAuthTypeModel struct {
	Id          int `json:"id" db:"id"`
	UsersId     int `json:"users_id" db:"users_id"`
	AuthTypesId int `json:"auth_types_id" db:"auth_types_id"`
}
