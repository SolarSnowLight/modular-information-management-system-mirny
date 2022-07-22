
import {ResponseData} from "./utils";
import ax, {getAccessJwt} from "./ax";






export type ArticleApi = {
    uuid?: string // external article id
    filepath: string // url path to title image
    title: string
    text: string
    tags: string // "#tag1 #tag2 #tag3"
    created_at?: string // yyyy-MM-dd'T'HH:mm:ss.SSSSSS? // "2022-07-21T10:06:47.260527Z" // todo what is Z at the end
    updated_at?: string // yyyy-MM-dd'T'HH:mm:ss.SSSSSS? // "2022-07-21T10:06:47.260527Z" // todo what is Z at the end
    files: ArticleImageApi[] | null
}
export type ArticleImageApi = {
    files_id: null // todo null or ...
    index: number // localId
    filename: string
    filepath: string // url path to title image
}




export type ArticleApiResponse = ArticleApi

const getArticleById = async (id: string): ResponseData<ArticleApiResponse> => {
    return ax.post('user/article/get',{
        uuid: id
    }, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type ArticlesApiResponse = { articles: ArticleApi[] | null }

const getUserArticles = async (): ResponseData<ArticlesApiResponse> => {
    return ax.post('user/article/get/all', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type ArticleCreationApi = {
    title: string // article title
    title_file: Blob // image file for title image
    text: string // text with common tags like <p> <article-image>
    tags: string // '#tag1 #tag2 #tag3'
    files: { index: number, file: Blob }[] // image files for article text
}

export type ArticleCreationApiResponse = { success: boolean }

const createArticle = async (article: ArticleCreationApi): ResponseData<ArticleCreationApiResponse> => {
    const fd = new FormData()
    fd.append('title', article.title)
    fd.append('title_file', article.title_file, undefined)
    fd.append('text', article.text)
    fd.append('tags', article.tags)
    article.files.forEach(it=>fd.append('files',it.file,it.index+''))

    return ax.post('user/article/create', fd, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type ArticleUpdateApi = {
    uuid: string // id статьи
    title: string // article title
    title_file?: Blob|undefined // NEW image file for title image
    text: string // text with common tags like <p> <article-image>
    tags: string // '#tag1 #tag2 #tag3'
    files?: { index: number, file: Blob }[] // NEW image files for article text
    files_deleted?: number[]|undefined // localIds of deleted files
}

export type ArticleUpdateApiResponse = { success: boolean }

const updateArticle = async (article: ArticleUpdateApi): ResponseData<ArticleUpdateApiResponse> => {

    //console.log(article)

    const fd = new FormData()
    fd.append('uuid', article.uuid)
    fd.append('title', article.title)
    if (article.title_file) fd.append('title_file', article.title_file, undefined)
    fd.append('text', article.text)
    fd.append('tags', article.tags)
    article.files?.forEach(it=>fd.append('files',it.file,it.index+''))
    if (article.files_deleted) fd.append('files_deleted', JSON.stringify(article.files_deleted))

    return ax.post('user/article/update', fd, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}





export type ArticleDeletionApiResponse = { success: boolean }

const deleteArticle = async (id: string): ResponseData<ArticleDeletionApiResponse> => {
    return ax.post('user/article/delete',{
        uuid: id
    }, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}





export const articleApi = {
    getArticleById,
    getUserArticles,
    createArticle,
    updateArticle,
    deleteArticle,
}