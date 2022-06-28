import ax2 from "./ax2";
import {GraphQlData} from "./utils";



export type ArticleApi = {
    id: string

    title: string
    titleImage: ArticleImageApi
    theme: string
    shortDescription: string

    authors: string
    photographers: string

    publishDate: string
    viewsCnt: number
    isFavorite: boolean

    text: string
    images: Array<ArticleImageApi>
}
export type ArticleImageApi = {
    id: string
    index: number
    image: ImageApi
}
export type ImageApi = {
    id: string
    path: string
}


export type ArticlesResponse = { articles: ArticleApi[] }
const getArticles = async () => {
    return ax2.post<GraphQlData<ArticlesResponse>>('graphql',{
        query: `{
            articles {
                id, title
                titleImage {
                    id, index,
                    image {
                        id, path
                    }
                }
                theme, shortDescription
                authors, photographers
                publishDate, viewsCnt, isFavorite
                text
                images {
                    id, index,
                    image {
                        id, path
                    }
                }
            }
        }`
    })
}





export const articleApiMock = {
    getArticles,
}