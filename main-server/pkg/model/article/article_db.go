package article

type ArticleDBModel struct {
	Id      int    `json:"id" binding:"required" db:"id"`
	UsersId int    `json:"users_id" binding:"required" db:"users_id"`
	Title   string `json:"title" binding:"required" db:"title"`
	Text    string `json:"text" binding:"required" db:"text"`
}

type ArticlesFilesDBModel struct {
	Index    int    `json:"index" binding:"required" db:"index"`
	Filename string `json:"filename" binding:"required" db:"filename"`
	Filepath string `json:"filepath" binding:"required" db:"filepath"`
}
