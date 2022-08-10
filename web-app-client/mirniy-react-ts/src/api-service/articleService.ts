
import {errorUtils} from "src/utils/errorUtils";
import {Serv, ServiceData, serviceUtils} from "./utils";
import {
    ArticleApi,
    articleApi,
    ArticleCreationApiInput, ArticlesApi,
    ArticleUpdateApiInput,
} from "src/api/articleApi";
import {awaitPromisesArray, joinTags} from "src/utils/utils";
import {Article, articleApiToArticle} from "./articleServiceUtils";
import {SuccessApi} from "../api/utils";






export type ArticleServ = { article: Article }

const getArticleById = async (id: string): Serv<ArticleServ> => {
    try {
        let { status, data } = await articleApi.getArticleById(id)

        if (status===200) {
            data = data as ArticleApi
            return serviceUtils.buildData<ArticleServ>({
                article: await articleApiToArticle(data)
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




export type ArticlesServ = { articles: Article[] }

const getUserArticles = async (): Serv<ArticlesServ> => {
    try {
        let { status, data } = await articleApi.getUserArticles()

        if (status===200) {
            data = data as ArticlesApi
            return serviceUtils.buildData<ArticlesServ>({
                articles: await awaitPromisesArray(data.articles?.map(articleApiToArticle))
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




export type ArticleSaveServ = { result: 'updated' | 'saved' }

const saveArticle = async (article: Article): Promise<ServiceData<ArticleSaveServ>> => {
    const a = article
    const titleIm = a.images.find(it=>it.props.isTitleNew && !it.props.isDeleted)
    if (!titleIm) return { error: errorUtils.of('required', 'Title image is required') }
    if (!a.title) return { error: errorUtils.of('required', 'Title is required') }
    if (!a.text) return { error: errorUtils.of('required', 'Title image is required') }

    if (!a.id){ // create article
        const aApi: ArticleCreationApiInput = {
            title: a.title,
            title_file: a.images
                .find(it=>it.props.isTitleNew && !it.props.isTitle && it.props.isNew && !it.props.isDeleted)?.image?.blob!,
            text: a.text,
            tags: joinTags(article.tags),
            files: a.images
                .filter(it=>it.props.isTextNew && !it.props.isText && it.props.isNew && !it.props.isDeleted)
                .map(it=>({ index: it.localId, file: it.image?.blob! }))
        }

        try {
            let { status, data } = await articleApi.createArticle(aApi)

            if (status===200) {
                data = data as SuccessApi
                if (!data.success) return serviceUtils.defaultError()
                return serviceUtils.buildData<ArticleSaveServ>({ result: 'saved' })
            }

            return serviceUtils.defaultError()
        } catch (e: any){
            return serviceUtils.generalError(e)
        }
    } else { // update article
        //console.log('title image:',a.images.find(it=>it.props.isTitleNew && !it.props.isTitle))
        //console.log('test image no-cors',await (await fetch("http://localhost:5000/public/fe4d0fb5-2c07-499e-a4d9-81cc473c9977", { mode: 'no-cors' })).blob())
        //console.log('test image',await (await fetch("http://localhost:5000/public/fe4d0fb5-2c07-499e-a4d9-81cc473c9977")).blob())
        const aUApi: ArticleUpdateApiInput = {
            uuid: a.id,
            title: a.title,
            title_file: a.images
                .find(it=>it.props.isTitleNew && !it.props.isTitle && it.props.isNew && !it.props.isDeleted)?.image?.blob,
            text: a.text,
            tags: joinTags(article.tags),
            files: a.images
                .filter(it=>it.props.isTextNew && !it.props.isText && it.props.isNew && !it.props.isDeleted)
                .map(it=>({ index: it.localId, file: it.image?.blob! })),
            files_deleted: a.images
                .filter(it=>!it.props.isNew && it.props.hasServerLocalId && (!it.props.isTextNew || it.props.isDeleted))
                .map(it=>it.localId)
        }

        try {
            let { status, data } = await articleApi.updateArticle(aUApi)

            if (status===200) {
                data = data as SuccessApi
                if (!data.success) return serviceUtils.defaultError()
                return serviceUtils.buildData<ArticleSaveServ>({ result: 'updated' })
            }

            return serviceUtils.defaultError()
        } catch (e: any){
            return serviceUtils.generalError(e)
        }
    }
}




const deleteArticle = async (id: string): Serv<undefined> => {
    try {
        let { status, data } = await articleApi.deleteArticle(id)

        if (status===200) {
            data = data as SuccessApi
            if (!data.success) return serviceUtils.defaultError()
            return serviceUtils.buildData(undefined)
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}


export const articleService = {
    getArticleById,
    getUserArticles,
    saveArticle,
    deleteArticle,
}