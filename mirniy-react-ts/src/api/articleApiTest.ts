import axTest from "./axTest";
import {GraphQlData} from "./utils";



export type ArticleApi = {
    id: string|number

    title: string
    titleImage: ArticleImageApi
    theme: string
    tags: string[]
    shortDescription: string

    authors: string
    photographers: string

    publishDate: string
    viewsCnt: number
    isFavorite: boolean

    text: string
    htmlContent: string

    images: Array<ArticleImageApi> // TODO remove
}
export type ArticleImageApi = {
    articleId: string|number
    localId: number
    image: ImageApi
}
export type ImageApi = {
    id: string|number
    url: string
}


export type ArticlesResponse = { articles: ArticleApi[] }
const getArticles = async () => {
    return axTest.post<GraphQlData<ArticlesResponse>>('graphql',{
        query: `{
            articles {
                id, title
                titleImage {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                theme, shortDescription
                authors, photographers
                publishDate, viewsCnt, isFavorite
                text, htmlContent
                images {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                tags
            }
        }`
    })
}



export type ArticleResponse = { article: ArticleApi }
const getArticleById = async (id: string) => {
    return axTest.post<GraphQlData<ArticleResponse>>('graphql',{
        query: `{
            article(id: ${id}) {
                id, title
                titleImage {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                theme, shortDescription
                authors, photographers
                publishDate, viewsCnt, isFavorite
                text, htmlContent
                images {
                    articleId, localId,
                    image {
                        id, url
                    }
                }
                tags
            }
        }`
    })
}





export const articleApiTest = {
    getArticles,
    getArticleById,
}