import ax2 from "./ax2";
import {GraphQlData} from "./utils";



export type ArticleApi = {
    id: string

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
    content: string
    images: Array<ArticleImageApi> // TODO remove
}
export type ArticleImageApi = {
    id: string
    index: number
    image: ImageApi
}
export type ImageApi = {
    id: string
    url: string
}


export type ArticlesResponse = { articles: ArticleApi[] }
const getArticles = async () => {
    return ax2.post<GraphQlData<ArticlesResponse>>('graphql',{
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
                text, content
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
    return ax2.post<GraphQlData<ArticleResponse>>('graphql',{
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
                text, content
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





export const articleApiMock = {
    getArticles,
    getArticleById,
}