
import {ResponseData} from "./utils";
import ax from "./ax";
import {Article} from "src/api-service/articleService";
import {store} from "src/redux/store";


export type ArticleApi = {
    uuid?: string // external article id
    filepath: string // url path to title image
    title: string
    text: string
    tags: string // "#tag1 #tag2 #tag3"
    date_created?: string // yyyy-MM-dd'T'HH:mm:ss? // "2022-07-11T00:00:00Z" // todo what is Z at the end
    files: ArticleImageApi[] | null
}
export type ArticleImageApi = {
    files_id: null // todo null or ...
    index: number // localId
    filename: string
    filepath: string // url path to title image
}




/*

export type ArticleApiResponse = ArticleApi

const getArticleById = async (id: string /!* todo *!/ ) => {
    return axTest.post<ResponseData<ArticleApiResponse>>('article/get',{
        // todo
    })
}
*/



export type ArticlesApiResponse = { articles: ArticleApi[] | null }

const getUserArticles = async (): ResponseData<ArticlesApiResponse> => {
    return ax.post('user/article/get/all', undefined, {
        headers: { Authorization: `Bearer ${store.getState().user.accessJwt}`}
    })
}





export type ArticleCreationResponse = { success: boolean }

const createArticle = async (article: Article): ResponseData<ArticleCreationResponse> => {
    const fd = new FormData()

    fd.append('title', article.title ?? '')
    fd.append('text', article.text ?? '')
    fd.append('tags', (article.tags??[]).join(' #'))

    const tam = article.titleImage
    if (!tam) throw new Error('Title image is required')
    fd.append('title_file', tam.image.file!, undefined)

    article.textImages.forEach(it=>fd.append('files',it.image.file!,it.localId+''))

    return ax.post('user/article/create', fd, {
        headers: { Authorization: `Bearer ${store.getState().user.accessJwt}`}
    })
}



/*
export type ArticleDeletionResponse = { /!* todo *!/ }

const deleteArticle = async ( /!* todo *!/ ) => {
    return axTest.post<ResponseData<>>('article/delete',{
        // todo
    })
}
*/





export const articleApi = {
    //getArticleById,
    getUserArticles,
    createArticle,
    //deleteArticle,
}