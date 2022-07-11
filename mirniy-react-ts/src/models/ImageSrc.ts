import {readAsUrl} from "../utils/utils";

export class ImageSrc {
    private constructor(
        public id: number,
        public file?: File,
        public url?: string,
        public dataUrl?: string,
    ) { }

    // как только создаём изображение из файла, то сразу загружаем его
    // потом берём url с помощью getUrl()
    static async fromFile(id:number, file: File){
        const im = new ImageSrc(id, file)
        await im.fetchUrl()
        return im
    }

    static fromUrl(id:number, url: string){
        return new ImageSrc(id, undefined, url)
    }

    static fromDataUrl(id:number, dataUrl:string){
        return new ImageSrc(id, undefined, undefined, dataUrl)
    }

    async fetchUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.url) return this.url
        if (this.file) {
            const dataUrl = await readAsUrl(this.file)
            return this.dataUrl = dataUrl
        }
    }

    getUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.url) return this.url
    }
}

