

import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useObjectToKey} from "../../hooks/useOjectToKey";
import styled from "styled-components";
import Space from "src/components/Space";
import Input1 from "src/components/Input1";
import Button1 from "src/components/Button1";
import CrossIc from "../../components/icons/CrossIc";
import {lastFocused} from "../../utils/documentUtils";
import {appActions} from "../../redux/appReducer";
import {ArticleApi} from "../../api/articleApiMock";
import {DateTime} from "../../utils/DateTime";
import Popup from "../../components/Popup";
import Article from "./Article";
import ArticleView from "./ArticleView";






const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const imageTag =/<image[ \n]+id=(?<id>\d+)[ \n]*\/>/g

const wordExtensions = /\.((doc)|(docx))$/i


const ArticleCreator2 = () => {

    const d = useAppDispatch()
    const { isDraggingFiles } = useAppSelector(s=>s.app)
    const getId = useObjectToKey()

    const [title, setTitle] = useState('')
    const onTitleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(ev.currentTarget.value)
    }

    const [tags, setTags] = useState('')
    const onTagsInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTags(ev.currentTarget.value)
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [text, setText] = useState('')
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

    const titleImageFrameRef = useRef<HTMLDivElement>(null)


    const [titleImage, setTitleImage] = useState(undefined as File|undefined)
    const [images, setImages] = useState([] as File[])
    const [word, setWord] = useState(undefined as undefined|File)

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


    const onImagePaste = (file: File, id: number) => {
        const area = textareaRef.current
        if (area && lastFocused === area){
            const s = area.selectionStart
            const oldLen = text.length
            const newText = text.substring(0,s)+`<image id=${id}/>`+text.substring(s)
            setText(newText)
            const newSel = s+(newText.length-oldLen)
            setNewSelection({s: newSel, e: newSel})
            area.focus()
            return
        }
        const titleImageFrame = titleImageFrameRef.current
        if (titleImageFrame && lastFocused === titleImageFrame){
            setTitleImage(file)
            titleImageFrame.focus()
            return
        }
    }

    const [showPreview, setShowPreview] = useState(false)
    const [article, setArticle] = useState(undefined as ArticleApi|undefined)

    const onPreview = () => {
        if (preparingData) return
        setPreparingData(true)
        const map = preparedArticleData[0]
        map.clear()
        setPreparedArticleData([map])
        prepareArticleData()
    }

    const [preparedArticleData, setPreparedArticleData] = useState([new Map<File,string>()])
    const [preparingData, setPreparingData] = useState(false)

    const prepareArticleData = () => {
        if (titleImage){
            const allFiles = [titleImage, ...images]
            const map = preparedArticleData[0]
            allFiles.forEach(it=>{
                const reader = new FileReader()
                reader.onloadend = (ev) => {
                    map.set(it,ev.target?.result as string)
                    setPreparedArticleData([map])
                }
                reader.readAsDataURL(it)
            })
        }
    }

    useEffect(()=>{
        const map = preparedArticleData[0]
        if (map.size===images.length+1){
            const article = prepareArticle()
            if (article) {
                setArticle(article)
                //navigate('/article-preview')
                setShowPreview(true)
                setPreparingData(false)
            }
        }
    }, [preparedArticleData])

    const prepareArticle = (): ArticleApi|undefined => {


        imageTag.lastIndex = 0

        const idToFile = new Map<number,File>()
        images.forEach(it=>idToFile.set(getId(it),it))

        let content = ''
        const map = preparedArticleData[0]

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
                const preparedImageTag = `<img src="${map.get(file)!}" style="display: block; width: 100%; height: 300px; object-fit: cover;"/>`
                shiftBack -= preparedImageTag.length
                content += text.substring(pos,s) + preparedImageTag
                pos = s+len
            }
        }
        content += text.substring(pos)


        const article: ArticleApi = {
            id: '',
            title: title,
            titleImage: {
                id: '', index: -1, image: {
                    id: '', path: map.get(titleImage!)!
                }
            },
            theme: '',
            tags: tags.split(/\s*#/).filter(it=>it),
            shortDescription: '',

            authors: '',
            photographers: '',
            publishDate: DateTime.fromDate(new Date()).to_yyyy_MM_dd_HH_mm(),
            viewsCnt: 0,
            isFavorite: false,

            text: '',
            content: `<p>${content}</p>`, // TODO
            //content: `<p>TEXT</p>`, // TODO
            images: [],
        }



            return article

    }


    return <Page>

        { showPreview && article && <Popup onClose={()=>setShowPreview(false)}>
            <ArticlePreviewFrame>
                <ArticleView article={article}/>
            </ArticlePreviewFrame>
        </Popup> }

        <ImagesFrame onDrop={onFilesDrop}>

            { images.length > 0 && <ImagesList className={common.column}>
                <ImagesTitle>Изображения</ImagesTitle>
                { images.map(it=><ImageItem file={it} id={getId(it)} key={getId(it)}
                                            onRemove={onRemove} onPaste={onImagePaste} />) }
            </ImagesList> }

            { isDraggingFiles && <DragOverlay className={common.abs+' '+common.row}/>}
        </ImagesFrame>

        <ArticleFrame className={common.column}>

            <TitleText>Шапка статьи</TitleText>

            <Space h={35}/>

            <Input1 h={60} title='Заголовок' placeholder='Введите заголовок'
                    value={title} onInput={onTitleInput}
                    titleFont='TT Commons' titleColor='#424041'
                    placeholderFont='TT Commons' placeholderColor='#8B8B8B'
                    textFont='TT Commons' textColor='black'
                    borderColor='#8B8B8B'
            />

            <Space h={35}/>

            <TitleImageFrame ref={titleImageFrameRef} tabIndex={0}>
                <TitleImage file={titleImage} />
            </TitleImageFrame>

            <Space h={35}/>

            <TitleText>Текст статьи</TitleText>

            <Space h={35}/>

            <TextArea ref={textareaRef} value={text} onInput={onTextInput} />

            <Space h={35}/>

            <Input1 h={60} title='Теги' placeholder='#тег1 #тег2 #тег3'
                    value={tags} onInput={onTagsInput}
                    titleFont='TT Commons' titleColor='#424041'
                    placeholderFont='TT Commons' placeholderColor='#8B8B8B'
                    textFont='TT Commons' textColor='black'
                    borderColor='#8B8B8B'
            />

            <Space h={35}/>

            <Button1 w={170}  h={54} onClick={onPreview} title='Предпросмотр'/>

        </ArticleFrame>

    </Page>

}
export default ArticleCreator2


const Page = styled.div`
  width: 100%;
  padding: 135px 599px 135px 194px;
  background: #FCFCFC; /* White */
`
const ArticleFrame = styled.div`
  
`

const ArticlePreviewFrame = styled.div`
  width: fit-content; height: fit-content;
  padding: 16px;
  background: #FCFCFC; /* White */
`

const ImagesFrame = styled.div`
  position: fixed;
  top: 135px; right: 193px; bottom: 0;
  width: 358px;
  overflow-y: scroll;
`
const ImagesList = styled.div`
  background: #8B8B8B; // Gray 2
  border-radius: 4px;
  padding: 19px; gap: 19px;
`
const DragOverlay = styled.div`
  background-color: rgba(255,255,255,.6);
  border: dashed grey 4px;
  border-radius: 4px;
  pointer-events: none;
`
const ImagesTitle = styled.div`
  font: 600 22px 'TT Commons';
  color: #FCFCFC; // White
  letter-spacing: .02em;
`

const TitleImageFrame = styled.div`
  box-sizing: content-box;
  width: 360px; height: 300px;
  padding: 12px 19px;
  border: 2px dashed #1F8DCD;
  border-radius: 4px;
  cursor: pointer;
  :focus {
    //width: 356px; height: 296px;
    border: 2px solid #1F8DCD;
  }
`


const TitleText = styled.div`
  font: 500 29px 'TT Commons';
  color: black;
`

const TextArea = styled.textarea`
  height: 400px;
  border: 2px solid #8B8B8B;
  border-radius: 4px;
  padding: 17px;
  font: 400 19px 'TT Commons';
  color: black;
  resize: vertical;
`




const TitleImage = ({ file }: { file?: File }) => {

    const [fileUrl, setFileUrl] = useState(undefined as undefined|URL)
    useEffect(()=>{
        if (file){
            const reader = new FileReader()
            reader.onload = (ev) => {
                setFileUrl(new URL(ev.target?.result as string))
            }
            //reader.readAsArrayBuffer(file)
            reader.readAsDataURL(file)
        }
    }, [file])

    return <TitleImageView imageUrl={fileUrl}/>
}

const TitleImageView = styled.div<{ imageUrl?: URL }>`
  width: 100%; height: 100%;
  background-image: url("${p=>p.imageUrl+''}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`



const ImageItem = (
    { file, id, onRemove, onPaste }
        : { file: File, id: number, onRemove: (file:File)=>void, onPaste: (file:File,id:number)=>void }
) => {


    const [fileUrl, setFileUrl] = useState(undefined as undefined|URL)

    useEffect(()=>{
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (ev) => {
            setFileUrl(new URL(ev.target?.result as string))
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



    return <ImageItemFrame
        /*draggable onDragStart={onDragStart}*/>

        <ImageItemText>id: {id}</ImageItemText>
        <CrossContainer onClick={()=>onRemove(file)}><CrossIc color='black'/></CrossContainer>

        <Image imageUrl={fileUrl}/>

        <ButtonBox>
            <Button1 title='Добавить' onClick={()=>onPaste(file,id)}
                     style={{
                         background: '#1F8DCD',
                         font: "300 19px 'TT Commons'", color: '#FCFCFC',
                     }}
            />
        </ButtonBox>


        {/*<div style={{ display: "flex", flexFlow: 'column nowrap' }}>
            <div>id: {id}</div>
            <button onClick={()=>onPaste(id)}>Paste</button>
        </div>*/}


    </ImageItemFrame>

}

const ImageItemFrame = styled.div`
  display: grid;
  grid-template: auto auto / 1fr auto;
`
const ImageItemText = styled.div`
  font: 400 19px 'TT Commons';
  color: #424041; // Gray1
  grid-area: 1 / 1;
`
const CrossContainer = styled.div`
  width: 16px; height: 16px; align-self: end;
  margin: 6px;
  grid-area: 1 / 2;
  cursor: pointer;
`
const Image = styled.div<{ imageUrl?: URL }>`
  width: 100%; height: 274px;
  background-image: url("${p=>p.imageUrl+''}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  grid-area: 2 / 1 / span 1 / span 2;
`
const ButtonBox = styled.div`
  width: 108px; height: 32px;
  margin: 0 10px 10px 0;
  align-self: end; justify-self: end;
  grid-area: 2 / 1 / span 1 / span 2;
`





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
