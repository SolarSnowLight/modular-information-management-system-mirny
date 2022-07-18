
import {errors} from "src/models/errors";
import {ServiceData} from "./utils";
import Axios, {AxiosError} from "axios";
import {ArticleApi, articleApi, ArticlesApiResponse} from "src/api/articleApi";
import {readAsUrl, splitTags, trimSlash} from "src/utils/utils";
import {DateTime} from "src/utils/DateTime";
import {IdGenerator} from "src/models/IdGenerator";
import {API_URL} from "src/api/ax";



export class Article {
    constructor(
        public id?: string|number,

        public title?: string,
        public titleImageLocalId?: number,
        public theme?: string,
        public shortDescription?: string,
        public publishDate?: string, // yyyy-MM-dd'T'HH:mm // 2022-01-01T01:01
        public tags?: string[], // ['tag1', 'tag2', 'tag3'] // #tag1 #tag2 #tag3

        public authors?: string, // формат данных пока не определён
        public photographers?: string, // формат данных пока не определён

        public text?: string, // текст с общими тегами (<p> <i> <b> <mark> <article-image>)

        public images: ArticleImage[] = [],
        public textImagesLocalIds: number[] = [],

        public viewsCnt?: number,
        public isFavorite?: boolean,
    ) { }
    get titleImage(){
        return this.images.find(it=>it.localId===this.titleImageLocalId)
    }
    get textImages(){
        return this.images.filter(it=>this.textImagesLocalIds.includes(it.localId))
    }
}
export class ArticleImage {
    constructor(
        public localId: number,
        public image: Image,
    ) { }
}
export class Image {
    private constructor(
        public id: string|number|undefined,
        public file?: File,
        public remoteUrl?: string,
        public dataUrl?: string,
    ) { }

    // как только создаём изображение из файла, то сразу загружаем его
    // потом берём url с помощью getUrl()
    static async fromFile(id:string|number|undefined, file: File){
        const im = new Image(id, file)
        await im.fetchUrl()
        return im
    }

    static fromFileAndDataUrl(id:string|number|undefined, file: File, dataUrl: string){
        return new Image(id, file, undefined, dataUrl)
    }

    static fromRemoteUrl(id:string|number|undefined, url: string){
        return new Image(id, undefined, url)
    }

    static fromRemotePath(id:string|number|undefined, path: string, baseUrl: string){
        return new Image(id, undefined, trimSlash(baseUrl)+'/'+trimSlash(path))
    }

    static fromDataUrl(id:string|number|undefined, dataUrl:string){
        return new Image(id, undefined, undefined, dataUrl)
    }

    async fetchUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.remoteUrl) return this.remoteUrl
        if (this.file) {
            const dataUrl = await readAsUrl(this.file)
            return this.dataUrl = dataUrl
        }
    }

    getUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.remoteUrl) return this.remoteUrl
    }
}



export type ArticlesResponse = { articles: Article[] }

const getUserArticles = async (): Promise<ServiceData<ArticlesResponse>> => {
    return articleApi.getUserArticles().then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as ArticlesApiResponse
                return { data: {
                    articles: data.articles?.map(articleApiToArticle) ?? []
                } }
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



/*
export type ArticleResponse = { article: Article }

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
*/




export type ArticleCreationResponse = { }

const createArticle = async (article: Article): Promise<ServiceData<ArticleCreationResponse>> => {
    return articleApi.createArticle(article).then(
        response => {
            console.log('RESPONSE:', response)
            let { status, data } = response
            if (status===200) {
                data = data as ArticleCreationResponse
                return { data: { } }
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



function articleApiToArticle(articleApi: ArticleApi): Article {
    const aa = articleApi

    const textImagesLocalIds = (aa.files??[]).map(it=>it.index)

    const idGen = new IdGenerator()
    idGen.addExistingIds(textImagesLocalIds)
    const titleImId = idGen.getId()

    let images = (aa.files??[]).map(it=>new ArticleImage(
        it.index, Image.fromRemotePath(undefined, it.filepath, API_URL)
    ))
    images.push(new ArticleImage(
        titleImId, Image.fromRemotePath(undefined, aa.filepath, API_URL)
    ))

    const article = new Article(
        aa.uuid,
        aa.title,
        titleImId,
        undefined,
        undefined,
        DateTime.fromDate(new Date(aa.date_created!)).to_yyyy_MM_dd_HH_mm(),
        splitTags(aa.tags),
        undefined,
        undefined,
        aa.text,
        images,
        textImagesLocalIds,
        undefined,
        undefined,
    )
    return article
}



export const articleService = {
    getUserArticles,
    //getArticleById,
    createArticle,
}