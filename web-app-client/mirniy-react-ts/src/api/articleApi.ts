
import {ApiResult} from "./utils";
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




export type SuccessApi = { success: boolean }




const getArticleById = async (id: string): ApiResult<ArticleApi> => {
    return ax.post('user/article/get',{
        uuid: id
    }, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type ArticlesApi = { articles: ArticleApi[] | null }

const getUserArticles = async (): ApiResult<ArticlesApi> => {
    return ax.post('user/article/get/all', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type ArticleCreationApiInput = {
    title: string // article title
    title_file: Blob // image file for title image
    text: string // text with common tags like <p> <article-image>
    tags: string // '#tag1 #tag2 #tag3'
    files: { index: number, file: Blob }[] // image files for article text
}

const createArticle = async (article: ArticleCreationApiInput): ApiResult<SuccessApi> => {
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




export type ArticleUpdateApiInput = {
    uuid: string // id статьи
    title: string // article title
    title_file?: Blob|undefined // NEW image file for title image
    text: string // text with common tags like <p> <article-image>
    tags: string // '#tag1 #tag2 #tag3'
    files?: { index: number, file: Blob }[] // NEW image files for article text
    files_deleted?: number[]|undefined // localIds of deleted files
}

const updateArticle = async (article: ArticleUpdateApiInput): ApiResult<SuccessApi> => {
    const fd = new FormData()
    fd.append('uuid', article.uuid)
    fd.append('title', article.title)
    if (article.title_file) fd.append('title_file', article.title_file, undefined)
    fd.append('text', article.text)
    fd.append('tags', article.tags)
    article.files?.forEach(it=>fd.append('files',it.file,it.index+''))
    article.files_deleted?.forEach(it=>fd.append('files_deleted',it+''))

    return ax.post('user/article/update', fd, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




const deleteArticle = async (id: string): ApiResult<SuccessApi> => {
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