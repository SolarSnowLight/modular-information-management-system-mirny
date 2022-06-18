
import css from './ArticleNew.module.scss'

import React, {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../redux/hooks";
import {useObjectToKey} from "../hooks/useOjectToKey";
import {nonEmpty} from "@rrainpath/ts-utils";
import {useNavigate} from "react-router-dom";



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


const ArticleNew = () => {

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

    const prepareArticle = () => {

        navigate('/article-preview')
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

    return <div className={css.grid}>

        <div className={css.articleBox}>
            <textarea value={text} onInput={onTextInput} ref={textareaRef}/>
            {/*<div ref={divRef} onInput={onDivInput}
                 contentEditable dangerouslySetInnerHTML={{__html: divText}}/>*/}
            {/*<button onClick={rangeTest}>Test ranges</button>*/}
            {/*<button onClick={getSelection}>Get selection</button>*/}
            <button onClick={prepareArticle}>Предпросмотр статьи</button>
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