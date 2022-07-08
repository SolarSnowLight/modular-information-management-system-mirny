import {readAsUrl} from "../utils/utils";

export class ImageSrc {
    constructor(
        public id: number,
        public file?: File,
        public url?: string,
        public dataUrl?: string,
    ) { }

    async getUrl(){
        if (this.dataUrl) return this.dataUrl
        if (this.url) return this.url
        if (this.file) {
            const dataUrl = await readAsUrl(this.file)
            return this.dataUrl = dataUrl
        }
    }
}