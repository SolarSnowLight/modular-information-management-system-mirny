
import css from './ArticleNew.module.scss'

import React, {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {useObjectToKey} from "../hooks/useOjectToKey";
import {nonEmpty} from "@rrainpath/ts-utils";
import {useNavigate} from "react-router-dom";
import {appActions} from "../redux/appReducer";
import ArticlePreview from "./ArticlePreview";
import { IArticle } from 'src/models/IArticle';
import { userActions } from 'src/redux/userReducer';



/*import img1 from 'src/assets/images/0yhksE.jpg'
import img2 from 'src/assets/images/17-02-19_12-55-39.jpg'
import img3 from 'src/assets/images/Bleach.jpg'
import img4 from 'src/assets/images/Bleach Ichigo.jpg'
const imageFiles = [
    img1,
    img2,
    img3,
    img4
] as (string|File)[]*/


const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const imageTag =/<image[ \n]+id=(?<id>\d+)[ \n]*\/>/g // need to wrap into RegExp to prevent endless loop


const ArticleNew = () => {
    const { accessJwt, refreshJwt, user } = useAppSelector(s=>s.user)

    const d = useAppDispatch()

    // Create article
    const makeArticle = (data: IArticle) => {
        d(userActions.createArticle(data))
    }

    const [text, setText] = useState(
        `some content
Lorem    ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque culpa dicta dignissimos doloremque esse facilis illum, maxime minima nihil officia officiis pariatur quae quasi quod saepe sunt unde. Debitis.`
    )
    const onTextInput = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(ev.currentTarget.value)
    }

    const { isDraggingFiles } = useAppSelector(s=>s.app)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const divRef = useRef<HTMLDivElement>(null)

    const [divText, setDivText] = useState('')
    const onDivInput = (ev: React.ChangeEvent<HTMLDivElement>) => {
        const innerText = ev.currentTarget.innerText
        if (innerText===divText) return;
        if (innerText==='aaaa') {
            setDivText('aaa')
            return
        }
        setDivText(innerText)
    }

    const getSelection = () => {
        const area = textareaRef.current
        if (area) {
            console.log('selection start:',area.selectionStart)
            console.log('selection end:',area.selectionEnd)
        }
    }

    const navigate = useNavigate()

    const prepareArticle = (withModal: boolean = true) => {
        const regexp = RegExp(imageTag)

        const idToFile = new Map<number,File>()
        images.forEach(it=>idToFile.set(getId(it),it))

        const imageItems = [] as { index:number, file: File }[]

        //console.log(regexp)
        let clearedText = ''

        let result: RegExpExecArray|null
        let pos = 0
        let shiftBack = 0
        while(result = regexp.exec(text)){
            const s = result.index
            const clearedIndex = s-shiftBack
            const len = result[0].length
            shiftBack += len
            const id = +result.groups!.id
            const file = idToFile.get(id)!
            imageItems.push({ index: clearedIndex, file: file })
            //console.log('id to file:',id,file)
            //console.log(result)
            clearedText += text.substring(pos,s)
            pos = s+len
        }
        clearedText += text.substring(pos)
        //console.log(clearedText)

        if(withModal){
            d(appActions.setArticle({
                text: clearedText,
                images: imageItems
            }))
    
            //navigate('/article-preview')
            setShowPreview(true)
        }

        return {
            text: clearedText,
            images: imageItems
        };
    }


    const rangeTest = () => {
        const textNode = textareaRef.current?.childNodes[0]
        if (textNode){
            const range = document.createRange()
            range.setStart(textNode,0)
            range.setEnd(textNode,10)
            console.log('RANGE:',range)
            console.log('RECTS:',range.getClientRects())
        }
        const divTextNode = divRef.current?.childNodes[0]
        if (divTextNode){
            const range = document.createRange()
            range.setStart(divTextNode,0)
            range.setEnd(divTextNode,10)
            console.log('RANGE:',range)
            console.log('RECTS:',range.getClientRects())
        }
    }


    const [images, setImages] = useState([] as File[])

    const onImagesDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFiles) {
            console.log('IMAGES DROP:',ev)

            const addImg = (file: File) => {
                if (imageExtensions.test(file.name))
                    setImages(images=>[...images, file])
            }

            for (const item of ev.dataTransfer.items){
                const fsItem = item.webkitGetAsEntry()
                walkFileTree(fsItem, addImg)
            }
        }
    }

    const onRemove = (file: File) => {
        setImages(images.filter(it=>it!==file))
    }

    const getId = useObjectToKey()

    const onPaste = (id: number) => {
        const area = textareaRef.current
        if (area){
            const s = area.selectionStart
            const oldLen = text.length
            const newText = text.substring(0,s)+`<image id=${id}/>`+text.substring(s)
            setText(newText)
            // todo set selection
            //area.selectionStart = s + (newText.length-oldLen)
        }
    }

    const [showPreview, setShowPreview] = useState(false)



    return <div className={css.grid}>

        { showPreview && <div className={css.previewFrame}>
            <div className={css.closeFrame} onClick={()=>setShowPreview(false)}>
                X
            </div>
            <div className={css.previewContent}>
                <ArticlePreview/>
            </div>
        </div> }

        <div className={css.articleBox}>
            <textarea value={text} onInput={onTextInput} ref={textareaRef}/>
            {/*<div ref={divRef} onInput={onDivInput}
                 contentEditable dangerouslySetInnerHTML={{__html: divText}}/>*/}
            {/*<button onClick={rangeTest}>Test ranges</button>*/}
            {/*<button onClick={getSelection}>Get selection</button>*/}
            <button onClick={(e) => {prepareArticle();}}>Предпросмотр статьи</button>
            <button onClick={(e) => {
                const data = prepareArticle(false);
                makeArticle(data as IArticle);
            }}>Сохранение</button>
            <button onClick={(e) => {
                console.log(prepareArticle(false).images);
            }}>Загрузка статьи с сервера</button>
        </div>

        <div className={css.imagesBox} onDrop={onImagesDrop}>

            { images.map(it=>
                <ImageItem file={it} id={getId(it)} key={getId(it)}
                           onRemove={onRemove} onPaste={onPaste}/>
            ) }

            {
                isDraggingFiles &&
                <div /*onDrop={onDrop}*/ className={css.dragOverlay}>
                    {/*<div className={css.dragOverlayText}>
                        drop files & folders here
                    </div>*/}
                </div>
            }
        </div>

    </div>
}
export default ArticleNew



const ImageItem = (
    { file, id, onRemove, onPaste }
        : { file: File, id: number, onRemove: (file:File)=>void, onPaste: (id:number)=>void }
) => {


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

    const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.dataTransfer.setData('application/json', JSON.stringify({
            type: 'imageItem', id: id
        }))
        ev.dataTransfer.effectAllowed = 'move'
    }


    const [isHovered, setIsHovered] = useState(false)

    return <div className={css.imageItem}
                /*draggable onDragStart={onDragStart}*/
                onMouseEnter={()=>setIsHovered(true)}
                onMouseLeave={()=>setIsHovered(false)}>

        <div className={css.imgPreview} style={{backgroundImage: `url(${fileUrl})`}}/>

        <div style={{ display: "flex", flexFlow: 'column nowrap' }}>
            <div>id: {id}</div>
            <button onClick={()=>onPaste(id)}>Paste</button>
        </div>


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