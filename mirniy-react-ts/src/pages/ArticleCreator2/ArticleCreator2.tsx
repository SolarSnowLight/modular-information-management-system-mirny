

import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "src/redux/hooks";
import {useObjectToKey} from "../../hooks/useOjectToKey";
import styled from "styled-components";
import Space from "src/components/Space";
import Input1 from "src/components/Input1";
import Button1 from "src/components/Button1";
import CrossIc from "src/components/icons/CrossIc";
import {lastFocused} from "src/utils/documentUtils";
import {ArticleApi} from "src/api/articleApiMock";
import {DateTime} from "src/utils/DateTime";
import Popup from "src/components/Popup";
import ArticleView from "../Main-pages/ArticleView";
import TitleImage from "./sub-components/TitleImage";
import {ImageSrc} from "src/entities/ImageSrc";
import {walkFileTree} from "../../utils/utils";
import {IdGenerator} from "../../entities/IdGenerator";
import ListImage from './sub-components/ListImage';




const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const imageTag =/<image[ \n]+id=(?<id>\d+)[ \n]*\/>/g

const wordExtensions = /\.((doc)|(docx))$/i




const ArticleCreator2 = () => {

    const d = useAppDispatch()
    const { isDraggingFiles } = useAppSelector(s=>s.app)

    const [idGen] = useState(new IdGenerator())

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

// todo
    const [titleImage, setTitleImage] = useState(undefined as ImageSrc|undefined)
    const [images, setImages] = useState([] as ImageSrc[])
    //const [word, setWord] = useState(undefined as undefined|File)

    const onFilesDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFiles) {
            //console.log('IMAGES DROP:',ev)

            const addFile = (file: File) => {
                if (imageExtensions.test(file.name))
                    setImages(images=>[...images, new ImageSrc(idGen.getId(),file)])
                else if (wordExtensions.test(file.name)){
                    //setWord(file)
                }
            }

            for (const item of ev.dataTransfer.items){
                const fsItem = item.webkitGetAsEntry()
                walkFileTree(fsItem, addFile)
            }
        }
    }

    const onRemove = (imageSrc: ImageSrc) => {
        setImages(images.filter(it=>it!==imageSrc))
    }


    const onImagePaste = (imageSrc: ImageSrc) => {
        const area = textareaRef.current
        if (area && lastFocused === area){
            const s = area.selectionStart
            const oldLen = text.length
            const newText = text.substring(0,s)+`<image id=${imageSrc.id}/>`+text.substring(s)
            setText(newText)
            const newSel = s+(newText.length-oldLen)
            setNewSelection({s: newSel, e: newSel})
            area.focus()
            return
        }
        const titleImageFrame = titleImageFrameRef.current
        if (titleImageFrame && lastFocused === titleImageFrame){
            setTitleImage(imageSrc)
            titleImageFrame.focus()
            return
        }
    }

    const [showPreview, setShowPreview] = useState(false)
    /*const [article, setArticle] = useState(undefined as ArticleApi|undefined)

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
                    id: '', url: map.get(titleImage!)!
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

    }*/


    return <Page>

        {/*{ showPreview && article && <Popup onClose={()=>setShowPreview(false)}>
            <ArticlePreviewFrame>
                <ArticleView article={article}/>
            </ArticlePreviewFrame>
        </Popup> }*/}

        <ImagesFrame onDrop={onFilesDrop}>

            { images.length > 0 && <ImagesList className={common.column}>
                <TitleForImages>Изображения</TitleForImages>
                { images.map(it=><ListImage imageSource={it} key={it.id}
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

            <TitleImage ref={titleImageFrameRef} tabIndex={0} imageSource={titleImage} />

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

            <Button1 w={170}  h={54} /*onClick={onPreview}*/ title='Предпросмотр'/>

        </ArticleFrame>

    </Page>

}
export default React.memo(ArticleCreator2)


const Page = React.memo(styled.div`
  width: 100%;
  padding: 135px 599px 135px 194px;
  background: #FCFCFC; /* White */
`)
const ArticleFrame = React.memo(styled.div`
  
`)

const ArticlePreviewFrame = React.memo(styled.div`
  width: fit-content; height: fit-content;
  padding: 16px;
  background: #FCFCFC; /* White */
`)

const ImagesFrame = React.memo(styled.div`
  position: fixed;
  top: 135px; right: 193px; bottom: 0;
  width: 358px;
  overflow-y: scroll;
`)
const ImagesList = React.memo(styled.div`
  background: #8B8B8B; // Gray 2
  border-radius: 4px;
  padding: 19px; gap: 19px;
`)
const DragOverlay = React.memo(styled.div`
  background-color: rgba(255,255,255,.6);
  border: dashed grey 4px;
  border-radius: 4px;
  pointer-events: none;
`)
const TitleForImages = React.memo(styled.div`
  font: 600 22px 'TT Commons';
  color: #FCFCFC; // White
  letter-spacing: .02em;
`)


const TitleText = React.memo(styled.div`
  font: 500 29px 'TT Commons';
  color: black;
`)

const TextArea = React.memo(styled.textarea`
  height: 400px;
  border: 2px solid #8B8B8B;
  border-radius: 4px;
  padding: 17px;
  font: 400 19px 'TT Commons';
  color: black;
  resize: vertical;
`)







