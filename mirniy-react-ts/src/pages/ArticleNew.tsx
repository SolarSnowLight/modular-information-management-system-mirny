
import css from './ArticleNew.module.scss'

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {useObjectToKey} from "../hooks/useOjectToKey";
import {useNavigate} from "react-router-dom";
import {appActions} from "../redux/appReducer";
import ArticlePreview from "./ArticlePreview";






const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const imageTag =/<image[ \n]+id=(?<id>\d+)[ \n]*\/>/g

const wordExtensions = /\.((doc)|(docx))$/i


const ArticleNew = () => {

    const d = useAppDispatch()


    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [text, setText] = useState(
        `some content
Lorem    ipsum dolor sit amet, consectetur adipisicing elit. Accusantium atque culpa dicta dignissimos doloremque esse facilis illum, maxime minima nihil officia officiis pariatur quae quasi quod saepe sunt unde. Debitis.`
    )
    const onTextInput = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(ev.currentTarget.value)
    }

    const [newSelection, setNewSelection] = useState(undefined as undefined|{ s:number, e:number })
    useLayoutEffect(()=>{
        if (newSelection && textareaRef.current){
            textareaRef.current.selectionStart = newSelection.s
            textareaRef.current.selectionEnd = newSelection.e
            setNewSelection(undefined)
            textareaRef.current.focus()
        }
    },[newSelection])

    const { isDraggingFiles } = useAppSelector(s=>s.app)

    //const divRef = useRef<HTMLDivElement>(null)

    /*const [divText, setDivText] = useState('')
    const onDivInput = (ev: React.ChangeEvent<HTMLDivElement>) => {
        const innerText = ev.currentTarget.innerText
        if (innerText===divText) return;
        if (innerText==='aaaa') {
            setDivText('aaa')
            return
        }
        setDivText(innerText)
    }*/

    /*const getSelection = () => {
        const area = textareaRef.current
        if (area) {
            console.log('selection start:',area.selectionStart)
            console.log('selection end:',area.selectionEnd)
        }
    }*/

    /*const navigate = useNavigate()*/

    const getId = useObjectToKey()

    const [images, setImages] = useState([] as File[])
    const [showPreview, setShowPreview] = useState(false)

    const [word, setWord] = useState(undefined as undefined|File)

    useEffect(()=>{
        if (word){
            const reader = new FileReader();
            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = (ev) => {
                /*textract.fromUrl(ev.target?.result as string, (err,text)=>{
                    console.log('err:', err)
                    console.log('text:', text)
                });*/

                /*mammoth.convertToHtml(ev.target?.result)
                    .then(function(result){
                        //var html = result.value; // The generated HTML
                        //var messages = result.messages; // Any messages, such as warnings during conversion
                        console.log('word:',result.value)
                    })
                    .done();*/
            };
            reader.readAsArrayBuffer(word)
            //reader.readAsDataURL(word);


            console.log("I AM HERE")



            /*textract.fromFileWithPath(word.name, (err,text)=>{
                console.log('err:', err)
                console.log('text:', text)
            })*/
        }
    },[word])

    const prepareArticle = () => {
        imageTag.lastIndex = 0

        const idToFile = new Map<number,File>()
        images.forEach(it=>idToFile.set(getId(it),it))

        const imageItems = [] as { index:number, file: File }[]

        //console.log(imageTag)
        let clearedText = ''

        let result: RegExpExecArray|null
        let pos = 0
        let shiftBack = 0
        while(result = imageTag.exec(text)){
            const s = result.index
            const clearedIndex = s-shiftBack
            const len = result[0].length
            shiftBack += len
            const id = +result.groups!.id
            const file = idToFile.get(id)
            if (!file){
                setNewSelection({s: s, e: s+len})
                alert(`Картинка с id=${id} в теге ${result[0]} (startIndex=${s}, endIndex=${s+len}) не найдена!`)
                return
            } else {
                imageItems.push({ index: clearedIndex, file: file })
                //console.log('id to file:',id,file)
                //console.log(result)
                clearedText += text.substring(pos,s)
                pos = s+len
            }
        }
        clearedText += text.substring(pos)
        //console.log(clearedText)

        d(appActions.setArticle({
            text: clearedText,
            images: imageItems
        }))

        //navigate('/article-preview')
        setShowPreview(true)
    }





    const onFilesDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFiles) {
            //console.log('IMAGES DROP:',ev)

            const addFile = (file: File) => {
                if (imageExtensions.test(file.name))
                    setImages(images=>[...images, file])
                else if (wordExtensions.test(file.name))
                    setWord(file)
            }

            for (const item of ev.dataTransfer.items){
                const fsItem = item.webkitGetAsEntry()
                walkFileTree(fsItem, addFile)
            }
        }
    }

    const onRemove = (file: File) => {
        setImages(images.filter(it=>it!==file))
    }


    const onImageTagPaste = (id: number) => {
        const area = textareaRef.current
        if (area){
            const s = area.selectionStart
            const oldLen = text.length
            const newText = text.substring(0,s)+`<image id=${id}/>`+text.substring(s)
            setText(newText)
            const newSel = s+(newText.length-oldLen)
            setNewSelection({s: newSel, e: newSel})

        }
    }




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
            <textarea value={text} onInput={onTextInput} ref={textareaRef} />
            {/*<div ref={divRef} onInput={onDivInput}
                 contentEditable dangerouslySetInnerHTML={{__html: divText}}/>*/}
            {/*<button onClick={rangeTest}>Test ranges</button>*/}
            {/*<button onClick={getSelection}>Get selection</button>*/}
            <button onClick={prepareArticle}>Предпросмотр статьи</button>
        </div>

        <div className={css.imagesBox} onDrop={onFilesDrop}>

            { images.map(it=>
                <ImageItem file={it} id={getId(it)} key={getId(it)}
                           onRemove={onRemove} onPaste={onImageTagPaste}/>
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

    /*const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.dataTransfer.setData('application/json', JSON.stringify({
            type: 'imageItem', id: id
        }))
        ev.dataTransfer.effectAllowed = 'move'
    }*/


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






/*const rangeTest = () => {
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
    }*/