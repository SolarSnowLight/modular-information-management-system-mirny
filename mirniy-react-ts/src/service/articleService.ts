import {articleApiTest, ArticleResponse, ArticlesResponse} from "../api/articleApiTest";
import {GraphQlData} from "../api/utils";
import {errors} from "../models/errors";
import {ServiceData} from "./utils";
import Axios, {AxiosError} from "axios";



const getArticles = async (): Promise<ServiceData<ArticlesResponse>> => {
    return articleApiTest.getArticles().then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as GraphQlData<ArticlesResponse>
                return { data: {
                        articles: data.data!.articles
                    }}
            }

            return { error: errors.of('error') }
        },
        (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error)){
                if (error.code==='ERR_NETWORK')
                    // error.code: "ERR_NETWORK" when server not found
                    return { error: { code: 'connection error' } }
            }
            return { error: { code: 'error' } }
        }
    )
}



const getArticleById = async (id: string): Promise<ServiceData<ArticleResponse>> => {
    return articleApiTest.getArticleById(id).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as GraphQlData<ArticleResponse>
                return { data: {
                        article: data.data!.article
                    }}
            }

            return { error: errors.of('error') }
        },
        (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error)){
                if (error.code==='ERR_NETWORK')
                    // error.code: "ERR_NETWORK" when server not found
                    return { error: { code: 'connection error' } }
            }
            return { error: { code: 'error' } }
        }
    )
}





export const articleService = {
    getArticles,
    getArticleById,
}