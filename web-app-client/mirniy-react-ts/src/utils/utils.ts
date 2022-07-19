


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

https://stackoverflow.com/questions/12168909/blob-from-dataurl
 */

export const dataUriToBlob = async (dataUri: string): Promise<Blob> =>
    await (await fetch(dataUri)).blob()


