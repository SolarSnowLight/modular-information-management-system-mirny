import axTest from "./axTest";
import {GraphQlData} from "./utils";
import {ImageSrc} from "../models/ImageSrc";



export type ArticleApi = {
    id?: string|number

    title?: string
    titleImageLocalId?: number
    theme?: string
    shortDescription?: string
    publishDate?: string // yyyy-MM-ddThh:mm // 2022-01-01T01:01
    tags: string[] // ['tag1', 'tag2', 'tag3'] // #tag1 #tag2 #tag3

    authors?: string // формат данных пока не определён
    photographers?: string // формат данных пока не определён


    text?: string // текст с общими тегами (<p> <i> <b> <mark> <article-image>)

    images: ArticleImageApi[]

    viewsCnt?: number
    isFavorite?: boolean
}
export type ArticleImageApi = {
    articleId?: string|number
    localId: number
    image: ImageApi
}
export type ImageApi = {
    id?: string|number
    url: string
}

export type Article = ArticleApi & {
    titleImageSrc?: ImageSrc
    imagesSrc: ImageSrc[]
    //htmlContent: string
}


export type ArticlesApiResponse = { articles: ArticleApi[] }

const getArticles = async () => {
    return axTest.post<GraphQlData<ArticlesApiResponse>>('graphql',{
        query: `{
            articles {
                id, 
                title, titleImageLocalId
                theme, shortDescription
                publishDate, tags
                authors, photographers
                text
                images {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                viewsCnt, isFavorite
            }
        }`
    })
}



export type ArticleApiResponse = { article: ArticleApi }

const getArticleById = async (id: string) => {
    return axTest.post<GraphQlData<ArticleApiResponse>>('graphql',{
        query: `{
            article(id: ${id}) {
                id, 
                title, titleImageLocalId
                theme, shortDescription
                publishDate, tags
                authors, photographers
                text
                images {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                viewsCnt, isFavorite
            }
        }`
    })
}





export const articleApiTest = {
    getArticles,
    getArticleById,
}