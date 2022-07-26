
import {errors} from "src/models/errors";
import {ServiceData} from "./utils";
import Axios, {AxiosError} from "axios";
import {
    ArticleApi,
    articleApi,
    ArticleApiResponse, ArticleCreationApi,
    ArticleCreationApiResponse, ArticleDeletionApiResponse,
    ArticlesApiResponse, ArticleUpdateApi, ArticleUpdateApiResponse
} from "src/api/articleApi";
import {awaitPromisesArray, joinTags, readAsUrl, splitTags, trimSlash, uriToBlob} from "src/utils/utils";
import {DateTime} from "src/utils/DateTime";
import {IdGenerator} from "src/models/IdGenerator";
import {Optional} from "@rrainpath/ts-utils";
import {files} from "src/api/files";



export class Article {
    constructor(
        public id?: string,

        public title?: string,
        public theme?: string,
        public shortDescription?: string,
        public createdAt?: string, // yyyy-MM-dd'T'HH:mm // 2022-01-01T01:01
        public updatedAt?: string, // yyyy-MM-dd'T'HH:mm // 2022-01-01T01:01
        public tags?: string[], // ['tag1', 'tag2', 'tag3'] // #tag1 #tag2 #tag3

        public authors?: string, // формат данных пока не определён
        public photographers?: string, // формат данных пока не определён

        public text?: string, // текст с общими тегами (<p> <i> <b> <mark> <article-image>)

        public images: ArticleImage[] = [],

        public viewsCnt?: number,
        public isFavorite?: boolean,
    ) { }
    get titleImage(){
        return this.images.find(it=>it.props.isTitle)
    }
    get textImages(){
        return this.images.filter(it=>it.props.isText)
    }
}
type ArticleImageProps = typeof ArticleImage.prototype.props
export class ArticleImage {
    props = {
        isTitle: false, // пришло по апи и используется в заголовке
        isText: false, // пришло по апи и используется в тексте
        isTitleNew: false, // используется в заголовке после редактирования (даже если не изменилось)
        isTextNew: false, // используется в тексте после редактирования (даже если не изменилось)
        isNew: false, // новый файл от пользователя
        hasServerLocalId: false, // имеет localId на сервере (только для изображений текста, заголовочное его не имеет в принципе)
        isDeleted: false, // изображение удалено пользователем
    }
    constructor(
        public localId: number,
        public image: Image|undefined,
        props?: Optional<ArticleImageProps>,
    ) {
        if (props) this.updateProps(props)
    }

    updateProps(props: Optional<ArticleImageProps>){
        this.props = { ...this.props, ...props }
    }
    clone(){
        return new ArticleImage(this.localId, this.image, {...this.props})
    }
}
export class Image {
    id: string|undefined
    name: string|undefined
    blob: Blob|undefined
    remoteUrl: string|undefined
    dataUrl: string|undefined

    private constructor(props: {
        id?: string|undefined
        name?: string|undefined
        blob?: Blob|undefined
        remoteUrl?: string|undefined
        dataUrl?:string|undefined
    }) {
        this.id = props.id
        this.name = props.name
        this.blob = props.blob
        this.remoteUrl = props.remoteUrl
        this.dataUrl = props.dataUrl
    }

    // Как только создаём изображение из файла, то сразу загружаем его контент в dataUrl.
    // Потом берём dataUrl с помощью getUrl().
    static async fromFile(file: File, id?: string){
        const im = new Image({ id: id, blob: file, name: file.name})
        await im.fetchUrl()
        return im
    }

    static fromFileAndDataUrl(file: File, dataUrl: string, id?: string){
        return new Image({ id: id, blob: file, name: file.name, dataUrl: dataUrl })
    }

    static async fromRemoteUrl(url: string, name: string|undefined, id?: string){
        const im = new Image({ id: id, name: name, remoteUrl: url })
        await im.fetchBlob()
        return im
    }

    static async fromRemotePath(path: string, baseUrl: string, name: string|undefined, id?: string){
        const im = new Image({ id: id, name: name, remoteUrl: trimSlash(baseUrl)+'/'+trimSlash(path) })
        await im.fetchBlob()
        return im
    }

    static async fromDataUrl(dataUrl:string, name: string|undefined, id?: string){
        const im = new Image({ id: id, name: name, dataUrl: dataUrl })
        await im.fetchBlob()
        return im
    }

    async fetchUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.remoteUrl) return this.remoteUrl
        if (this.blob) {
            const dataUrl = await readAsUrl(this.blob)
            return this.dataUrl = dataUrl
        }
    }

    async fetchBlob(){
        if (this.blob) return this.blob
        if (this.dataUrl) return uriToBlob(this.dataUrl)
        if (this.remoteUrl) return uriToBlob(this.remoteUrl)
    }

    getUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.remoteUrl) return this.remoteUrl
    }

    getBlob(){
        if (this.blob) return this.blob
    }
}



export type ArticleResponse = { article: Article }

const getArticleById = async (id: string): Promise<ServiceData<ArticleResponse>> => {
    return articleApi.getArticleById(id).then(
        async response => {
            let { status, data } = response
            if (status===200) {
                data = data as ArticleApiResponse
                //console.log('a',data)
                return { data: {
                        article: await articleApiToArticle(data)
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



export type ArticlesResponse = { articles: Article[] }

const getUserArticles = async (): Promise<ServiceData<ArticlesResponse>> => {
    return articleApi.getUserArticles().then(
        async response => {
            let { status, data } = response
            if (status===200) {
                data = data as ArticlesApiResponse
                return { data: {
                        articles: await awaitPromisesArray(data.articles?.map(articleApiToArticle))
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
export type ArticleCreationResponse = { }

const createArticle = async (article: Article): Promise<ServiceData<ArticleCreationResponse>> => {

    const tam = article.titleImage
    if (!tam) throw new Error('Title image is required')

    const aApi: ArticleCreationApi = {
        title: article.title ?? '',
        title_file: tam.image.file!,
        text: article.text ?? '',
        tags: joinTags(article.tags),
        files: article.textImages.map(it=>({ index: it.localId, file: it.image.file! }))
    }

    return articleApi.createArticle(aApi).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as ArticleCreationApiResponse
                if (!data.success) return { error: errors.of('error') }
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
*/





export type ArticleSaveResponse = { result: 'updated' | 'saved' }

const saveArticle = async (article: Article): Promise<ServiceData<ArticleSaveResponse>> => {
    const a = article
    //console.log('before save:',a)
    const titleIm = a.images.find(it=>it.props.isTitleNew && !it.props.isDeleted)
    if (!titleIm) return { error: errors.of('required', 'Title image is required') }
    if (!a.title) return { error: errors.of('required', 'Title is required') }
    if (!a.text) return { error: errors.of('required', 'Title image is required') }

    if (!a.id){ // create article
        const aApi: ArticleCreationApi = {
            title: a.title,
            title_file: a.images
                .find(it=>it.props.isTitleNew && !it.props.isTitle && it.props.isNew && !it.props.isDeleted)?.image?.blob!,
            text: a.text,
            tags: joinTags(article.tags),
            files: a.images
                // картинка используется в тексте после редактирования
                // && картинка не была использована в тексте до редактирования
                // && картинка - новый файл
                .filter(it=>it.props.isTextNew && !it.props.isText && it.props.isNew && !it.props.isDeleted)
                .map(it=>({ index: it.localId, file: it.image?.blob! }))
        }

        return articleApi.createArticle(aApi).then(
            response => {
                let { status, data } = response
                if (status===200) {
                    data = data as ArticleCreationApiResponse
                    if (!data.success) return { error: errors.of('error') }
                    return { data: { result: 'saved' } }
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
    } else { // update article
        //console.log('title image:',a.images.find(it=>it.props.isTitleNew && !it.props.isTitle))
        //console.log('test image',await (await fetch("http://localhost:5000/public/af9e368e-1eac-424c-827d-bf360eb124a4", { mode: 'no-cors' })).blob())
        const aUApi: ArticleUpdateApi = {
            uuid: a.id,
            title: a.title,
            title_file: a.images
                .find(it=>it.props.isTitleNew && !it.props.isTitle && it.props.isNew && !it.props.isDeleted)?.image?.blob,
            text: a.text,
            tags: joinTags(article.tags),
            files: a.images
                // картинка используется в тексте после редактирования
                // && картинка не была использована в тексте до редактирования
                // && картинка - новый файл
                .filter(it=>it.props.isTextNew && !it.props.isText && it.props.isNew && !it.props.isDeleted)
                .map(it=>({ index: it.localId, file: it.image?.blob! })),
            files_deleted: a.images
                // картинка не используется в тексте после редактирования
                // && картинка была использована в тексте до редактирования
                // && картинка - старый файл
                .filter(it=>!it.props.isNew && it.props.hasServerLocalId && (!it.props.isTextNew || it.props.isDeleted))
                .map(it=>it.localId)
        }

        //console.log('before update', aUApi)

        return articleApi.updateArticle(aUApi).then(
            response => {
                let { status, data } = response
                if (status===200) {
                    data = data as ArticleUpdateApiResponse
                    if (!data.success) return { error: errors.of('error') }
                    return { data: { result: 'updated' } }
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
}




export type ArticleDeletionResponse = { }

const deleteArticle = async (id: string): Promise<ServiceData<ArticleDeletionResponse>> => {
    return articleApi.deleteArticle(id).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as ArticleDeletionApiResponse
                if (!data.success) return { error: errors.of('error') }
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




async function articleApiToArticle(articleApi: ArticleApi): Promise<Article> {
    const aa = articleApi

    const textImagesLocalIds = (aa.files??[]).map(it=>it.index)
    const idGen = new IdGenerator(textImagesLocalIds)
    const titleImId = idGen.getId()


    const imagePromises = (aa.files??[]).map(async it => new ArticleImage(
        it.index, await Image.fromRemotePath(it.filepath, files.API_URL, it.filename),
        { isText: true, hasServerLocalId: true })
    )

    const titleImPromise = (async() => new ArticleImage(
        titleImId, await Image.fromRemotePath(aa.filepath, files.API_URL, files.fileNameFromRemotePath(aa.filepath)),
        { isTitle: true }
    ))()

    /*let images = (aa.files??[]).map(it=>new ArticleImage(
        it.index, Image.fromRemotePath(it.filepath, API_URL, it.filename),
        { isText: true }
    ))
    images.push(new ArticleImage(
        titleImId, Image.fromRemotePath(aa.filepath, API_URL, it.filename),
        { isTitle: true }
    ))*/
    const images = [
        ...await awaitPromisesArray(imagePromises),
        await titleImPromise
    ]

    const createdAt = DateTime.fromDate(new Date(aa.created_at!)).to_yyyy_MM_dd_HH_mm()
    const updatedAt = DateTime.fromDate(new Date(aa.updated_at!)).to_yyyy_MM_dd_HH_mm()

    return  new Article(
        aa.uuid,
        aa.title,
        undefined,
        undefined,
        createdAt,
        updatedAt,
        splitTags(aa.tags),
        undefined,
        undefined,
        aa.text,
        images,
        undefined,
        undefined,
    )
}



export const articleService = {
    getArticleById,
    getUserArticles,
    saveArticle,
    deleteArticle,
}