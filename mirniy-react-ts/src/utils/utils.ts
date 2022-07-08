


export const wait = async <T>(delay:number, value?:T) => new Promise<T>(
    resolve => setTimeout(resolve,delay,value)
)




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
export function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);


    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const ab2 = Uint8Array.from(byteString, str => str.charCodeAt(0)).buffer

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;

}



export const dataUriToBlob = (dataUri: string): Blob|undefined => {

}

 */