package article

type FileArticleModel struct {
	Filename string
	Filepath string
	Index    int
}

type FileArticleExModel struct {
	Filename string
	Filepath string
	Index    int
	Id       int
}

type ArticleCreateResponse struct {
	IsCreated bool `json:"is_created"`
}

type ArticleResponse struct {
	Id    int                `json:"id" binding:"required"`
	Title string             `json:"title" binding:"required"`
	Text  string             `json:"text" binding:"required"`
	Files []FileArticleModel `json:"files" binding:"required"`
}
