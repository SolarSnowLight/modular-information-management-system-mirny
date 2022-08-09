import {ArticleApiFull, ArticleApi, articleApiTest, ArticleApiResponse, ArticlesApiResponse} from "../../api/test/articleApiTest";
import {GraphQlData} from "src/api/test/utils";
import {errorUtils} from "src/utils/errorUtils";
import {ServiceData} from "../utils";
import Axios, {AxiosError} from "axios";
import {ImageSrc} from "src/models/test/ImageSrc";


export type ArticlesResponse = { articles: ArticleApiFull[] }

const getArticles = async (): Promise<ServiceData<ArticlesResponse>> => {
    return articleApiTest.getArticles().then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as GraphQlData<ArticlesApiResponse>
                return { data: {
                        articles: data.data!.articles.map(articleApiToArticle)
                    }}
            }

            return { error: errorUtils.of('error') }
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


export type ArticleResponse = { article: ArticleApiFull }

const getArticleById = async (id: string): Promise<ServiceData<ArticleResponse>> => {
    return articleApiTest.getArticleById(id).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as GraphQlData<ArticleApiResponse>
                return { data: {
                        article: articleApiToArticle(data.data!.article)
                    }}
            }

            return { error: errorUtils.of('error') }
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



function articleApiToArticle(articleApi: ArticleApi): ArticleApiFull {
    let titleImageSrc
    let imagesSrc = articleApi.images.map(it=>{
        let newIm = ImageSrc.fromUrl(it.localId, it.image.url)
        if (newIm.id === articleApi.titleImageLocalId) titleImageSrc=newIm
        return newIm
    })
    const article = {
        ...articleApi,
        titleImageSrc,
        imagesSrc
    }
    return article
}



export const articleServiceTest = {
    getArticles,
    getArticleById,
}