import css from './Article.module.scss'
import {createRef, useEffect, useLayoutEffect, useRef, useState} from "react";
import {read} from "fs";
import {text} from "stream/consumers";
import LoadingIc from "../components/icons/LoadingIc";
import {useAppSelector} from "../redux/hooks";
import {appActions} from "../redux/appReducer";
import {useDebounce} from "../hooks/useDebounce";
import {useObjectToKey} from "../hooks/useOjectToKey";


const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i


function Article(){

    const { isDraggingFiles } = useAppSelector(s=>s.app)

    const [text, setText] = useState(
`some content
Lorem    ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque culpa dicta dignissimos doloremque esse facilis illum, maxime minima nihil officia officiis pariatur quae quasi quod saepe sunt unde. Debitis.`
    )
    const onTextInput = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(ev.currentTarget.value)
    }

    //const contentRef = useRef<HTMLDivElement>(null)

    const [images, setImages] = useState([] as File[])

    const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFiles){
            console.log('DROP:',ev)

            /*
                dataTransfer.items[*].type:
                    type: "image/jpeg"
                    type: "image/png"
                    type: "image/webp"
             */


            /*
            const imgs = [] as File[]

            for (const f of ev.dataTransfer.files) {


                if (!f.type.startsWith('image/')) continue
                imgs.push(f)
            }
            setImages([...images,...imgs])
            */

            const addImg = (file: File) => {
                if (imageExtensions.test(file.name))
                    setImages(images=>[...images, file])
            }

            for (const item of ev.dataTransfer.items){
                const fsItem = item.webkitGetAsEntry()
                walkFileTree(fsItem, addImg)
                /*if (fsItem?.isFile){
                    const fsFile = fsItem as FileSystemFileEntry
                    fsFile.file(
                        addImg,
                        err=>console.log('error creating file object: ',err)
                    )
                } else if (fsItem?.isDirectory){
                    console.log("IS DIRECTORY!!!")
                }*/

            }


        }

        /*
        const fs = ev.dataTransfer.files
        const elem = contentRef.current?.childNodes[0]
        if (fs.length>0 && elem){
            const range = document.createRange()

            console.log('ELEM:',elem)

            range.setStart(elem, 0)
            range.setEnd(elem, 4)

            //range.setStartAfter(contentRef.current)
            //range.setEndBefore(contentRef.current)

            range.getClientRects()


            console.log('RECTS:',range.getClientRects())


        }
        */
        /*
        for(let file of ev.dataTransfer.files){
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            //reader.readAsArrayBuffer(file)
            reader.readAsText(file, 'utf-8')
        }
        */

    }

    const onRemove = (file: File) => {
        setImages(images.filter(it=>it!==file))
    }


    const getKey = useObjectToKey()

    return <div style={{ minWidth: '100%', minHeight: '100vh' }}>
        <div className={css.dragFrame}>

            {/*<div
                //contentEditable
                className={css.content} ref={contentRef}
                //onInput={}
            >
                some content
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusantium atque culpa dicta dignissimos doloremque esse facilis illum,
                {
                    //<div className={css.floatDiv}><LoadingIc fill='#6663ff' size={20}/></div>
                }
                maxime minima nihil officia officiis pariatur quae quasi quod saepe sunt unde.
                Debitis.
            </div>*/}

            <div className={css.content}>

                <textarea value={text} onInput={onTextInput}
                style={{ width: '100%', height: '70%', resize: 'none' }}/>

                <div className={css.imagesBox}>
                    { images.map(im=><ImagePreview file={im} onRemove={onRemove} key={getKey(im)}/>) }
                </div>

            </div>

            {
                isDraggingFiles &&
                <div onDrop={onDrop} className={css.dragOverlay}>
                    <div className={css.dragOverlayText}>
                        drop files & folders here
                    </div>
                </div>
            }

        </div>
    </div>
}

export default Article





const ImagePreview = ({ file, onRemove }: { file: File, onRemove: (file:File)=>void }) => {

    const [fileUrl, setFileUrl] = useState(undefined as undefined|string)

    useEffect(()=>{
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (ev) => {
            setFileUrl(ev.target?.result as string)
        }
        //reader.readAsArrayBuffer(file)
        reader.readAsDataURL(file)
    }, [file])


    const [isHovered, setIsHovered] = useState(false)

    return <div className={css.imgWrap}
                onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}>
        <img src={fileUrl} />
        { isHovered && <div className={css.remove} onClick={()=>onRemove(file)}>
            <div style={{fontSize: '1rem', marginLeft: 3}}>X</div>
        </div> }
    </div>

}




function walkFileTree(fsItem: FileSystemEntry|null, onFile: (file:File)=>void){
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

