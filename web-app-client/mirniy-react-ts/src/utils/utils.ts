import {nonEmpty} from "@rrainpath/ts-utils";


export const wait = async <T>(delay:number, value?:T) => new Promise<T>(
    resolve => setTimeout(resolve,delay,value)
)


export const trimTails = (str: string, tail: string) =>
    str.replaceAll(RegExp(`^(${tail})|(${tail})$`,'g'),'')

export const trimSlash = (str: string) => trimTails(str,'/')


export const splitTags = (tagsStr: string) => tagsStr.trim().split(/\s*#/).slice(1)
export const joinTags = (tags?: string[]) => !tags || !tags.length ? '' : '#'+tags.join(' #')


// read file as DataURL (base64 url)
export const readAsUrl = async (file: Blob) => new Promise<string>(
    (res, rej) => {
        const reader = new FileReader()
        reader.onload = ev => res(ev?.target?.result as string)
        reader.onerror = ev => rej(ev)
        //reader.readAsArrayBuffer(file)
        reader.readAsDataURL(file)
    }
)



export function walkFileTree(fsItem: FileSystemEntry|null, onFile: (file:File)=>void){
    if (fsItem?.isFile){
        const fsFile = fsItem as FileSystemFileEntry
        fsFile.file(
            onFile,
            err=>console.log('error creating file object: ',err)
        )
    } else if (fsItem?.isDirectory){
        const fsDir = fsItem as FileSystemDirectoryEntry
        fsDir.createReader().readEntries(
            (fsItems: FileSystemEntry[]) => fsItems.forEach(it=>walkFileTree(it,onFile)),
            err=>console.log('error reading directory: ',err)
        )
    }
}




/*
DataURL example:
var url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
var dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/

https://stackoverflow.com/questions/12168909/blob-from-dataurl
 */

// CORS error when remote url
export const dataUriToBlob = async (dataUri: string): Promise<Blob> =>
    await (await fetch(dataUri , { mode: 'no-cors' })).blob()

export const uriToBlob = dataUriToBlob

// CORS error when remote url
/*
export const uriToBlob = async (uri: string): Promise<Blob> => new Promise((res,rej)=>{
    const xhr = new XMLHttpRequest()
    xhr.open("GET", uri)
    xhr.responseType = 'blob'
    xhr.onerror = function (){console.log("Network error.")}
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('ok',xhr.response)
            res(xhr.response as Blob)
        }
        else {
            console.log('error',xhr.statusText)
        }
    }
    xhr.send()
})*/

/*
export const uriToBlob = async (uri: string): Promise<Blob> => {

    try {
        return await (await fetch(uri)).blob()
    } catch (e) {
        return new Promise((res, rej) => {
            const img = new Image()
            const c = document.createElement("canvas")
            const ctx = c.getContext('2d')
            img.onload = function () {
                debugger
                // @ts-ignore
                c.width = this.naturalWidth
                // @ts-ignore
                c.height = this.naturalHeight
                debugger
                // @ts-ignore
                ctx.drawImage(this, 0, 0)
                debugger
                c.toBlob(function (blob) {
                    debugger
                    res(blob!)
                }, 'image/jpeg', 0.75)
            }
            //img.crossOrigin = '*'
            //img.crossOrigin = ''
            img.crossOrigin = 'Anonymous'
            img.src = uri
        })
    }
    /!*return await (await fetch(uri)).blob()
        .catch(()=>new Promise((res,rej)=>{
            console.log('catching error')
            const img = new Image()
            const c = new HTMLCanvasElement()
            const ctx = c.getContext('2d')
            img.onload = function (){
                // @ts-ignore
                c.width = this.naturalWidth
                // @ts-ignore
                c.height = this.naturalHeight
                // @ts-ignore
                ctx.drawImage(this,0,0)
                c.toBlob(function(blob){
                    res(blob!)
                }, 'image/jpeg', 0.75)
            }
            img.crossOrigin = ''
            img.src = uri
        }))*!/
}*/



// get only resolved promises result when all promises are settled
export const awaitPromisesArray = async <V>(promises: Promise<V>[] = []) =>
    (await Promise.allSettled(promises))
        .map(it=>{
            if (it.status==='fulfilled') return it.value
            return undefined
        })
        .filter(nonEmpty)
