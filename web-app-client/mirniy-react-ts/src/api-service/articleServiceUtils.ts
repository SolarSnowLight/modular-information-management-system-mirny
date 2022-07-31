import {Optional} from "@rrainpath/ts-utils";
import {awaitPromisesArray, readAsUrl, splitTags, trimSlash, uriToBlob} from "src/utils/utils";
import {ArticleApi} from "src/api/articleApi";
import {IdGenerator} from "src/models/IdGenerator";
import {files} from "src/api/files";
import {DateTime} from "src/utils/DateTime";




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
        public image: Img|undefined,
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
export class Img {
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
        const im = new Img({ id: id, blob: file, name: file.name})
        await im.fetchUrl()
        return im
    }

    static fromFileAndDataUrl(file: File, dataUrl: string, id?: string){
        return new Img({ id: id, blob: file, name: file.name, dataUrl: dataUrl })
    }

    static async fromRemoteUrl(url: string, name: string|undefined, id?: string){
        const im = new Img({ id: id, name: name, remoteUrl: url })
        await im.fetchBlob()
        return im
    }

    static async fromRemotePath(path: string, baseUrl: string, name: string|undefined, id?: string){
        const im = new Img({ id: id, name: name, remoteUrl: trimSlash(baseUrl)+'/'+trimSlash(path) })
        await im.fetchBlob()
        return im
    }

    static async fromDataUrl(dataUrl:string, name: string|undefined, id?: string){
        const im = new Img({ id: id, name: name, dataUrl: dataUrl })
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









export async function articleApiToArticle(articleApi: ArticleApi): Promise<Article> {
    const aa = articleApi

    const textImagesLocalIds = (aa.files??[]).map(it=>it.index)
    const idGen = new IdGenerator(textImagesLocalIds)
    const titleImId = idGen.getId()


    const imagePromises = (aa.files??[]).map(async it => new ArticleImage(
        it.index, await Img.fromRemotePath(it.filepath, files.API_URL, it.filename),
        { isText: true, hasServerLocalId: true })
    )

    const titleImPromise = (async() => new ArticleImage(
        titleImId, await Img.fromRemotePath(aa.filepath, files.API_URL, files.fileNameFromRemotePath(aa.filepath)),
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


