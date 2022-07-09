

import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "src/redux/reduxHooks";
import {useObjectToKey} from "../../hooks/useOjectToKey";
import styled from "styled-components";
import Space from "src/components/Space";
import Input1 from "src/components/Input1";
import Button1 from "src/components/Button1";
import CrossIc from "src/components/icons/CrossIc";
import {lastFocused} from "src/utils/documentUtils";
import {ArticleApi} from "src/api/articleApiTest";
import {DateTime} from "src/utils/DateTime";
import Popup from "src/components/Popup";
import ArticleView from "../ArticleView/ArticleView";
import TitleImage from "./sub-components/TitleImage";
import {ImageSrc} from "src/models/ImageSrc";
import {walkFileTree} from "../../utils/utils";
import {IdGenerator} from "../../models/IdGenerator";
import ListImage from './sub-components/ListImage';




const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const imageTag =/<image[ \n]+id=(?<id>\d+)[ \n]*\/>/g

const wordExtensions = /\.((doc)|(docx))$/i




const ArticleCreator = () => {

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
            const newText = text.substring(0,s)+`${"\n"}<article-image localId="${imageSrc.id}"/>${"\n"}`+text.substring(s)
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

    const [preparingArticle, setPreparingArticle] = useState(false)
    const [article, setArticle] = useState(undefined as ArticleApi|undefined)

    const onPreview = () => {
        if (preparingArticle) return
        setPreparingArticle(true)
        ;(async function(){
            const article = await prepareArticle()
            setArticle(article)
        })().finally(()=>setPreparingArticle(false))
    }

    const prepareArticle = async (): Promise<ArticleApi|undefined> => {

        const parser = new DOMParser()
        let wrappedText = `<root>${text}</root>` // need to wrap in some root tag
        let xmlDoc = parser.parseFromString(wrappedText, 'text/xml')

        const root = xmlDoc.childNodes[0]
        let currentP = undefined as undefined|ChildNode
        for (let i = 0; i<root.childNodes.length; ){
            const ch = root.childNodes[i]
            if (['#text','i','b','mark'].includes(ch.nodeName)){
                if (!currentP){
                    currentP = xmlDoc.createElement('p')
                    root.appendChild(currentP)
                    root.insertBefore(currentP, ch)
                    i++
                }
                currentP.appendChild(ch)
            } else {
                if ('article-image'===ch.nodeName){
                    const el = ch as Element
                    const src = await images.find(it=>it.id==el.attributes["localId"].value)!.getUrl()
                    const img = parser.parseFromString(
                        `<img src="${src}" style="display: block; width: 100%; height: 300px; object-fit: cover;"/>`,
                        'text/xml'
                    ).childNodes[0]
                    root.replaceChild(img, ch)
                }
                currentP = undefined
                i++
            }
        }

        const xmlSerializer = new XMLSerializer()
        let htmlContent = xmlSerializer.serializeToString(xmlDoc) // <root><p>some <i>italic</i> plain</p><img src="localId=2" style="display: block; width: 100%; height: 300px; object-fit: cover;"/><p>text more text</p></root>


        let titleImageUrl = await titleImage?.getUrl()
        titleImageUrl = titleImageUrl ?? ''

        const article: ArticleApi = {
            id: 'undefined',
            title: title,
            titleImage: {
                articleId: 'undefined',
                localId: titleImage?.id ?? -1,
                image: {
                    id: 'undefined',
                    url: titleImageUrl,
                }
            },
            theme: 'not specified',
            tags: tags.trim().split(/\s*#/).slice(1),
            shortDescription: 'not specified',

            authors: 'not specified',
            photographers: 'not specified',
            publishDate: DateTime.fromDate(new Date()).to_yyyy_MM_dd_HH_mm(),
            viewsCnt: 0,
            isFavorite: false,

            text: '',
            htmlContent: htmlContent,
            images: [],
        }
        return article
    }


    return <Page>

        { article && <Popup onClose={()=>setArticle(undefined)}>
            <ArticlePreviewCard>
                <ArticleView article={article}/>
                <Space h={35}/>
                <Button1 w={170} h={54} onClick={onPreview}>Предпросмотр</Button1>
            </ArticlePreviewCard>
        </Popup> }

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

            <Button1 w={138} h={42} style={{ font: '600 18px "TT Commons"' }} onClick={onPreview}>Предпросмотр</Button1>

        </ArticleFrame>

    </Page>

}
export default React.memo(ArticleCreator)


const Page = React.memo(styled.div`
  width: 100%;
  padding: 112px 500px 112px 112px;
  background: #FCFCFC; /* White */
`)
const ArticleFrame = React.memo(styled.div`
  
`)

const ArticlePreviewCard = React.memo(styled.div`
  width: fit-content; height: fit-content;
  padding: 32px;
  border-radius: 8px;
  background: #FCFCFC; /* White */
`)

const ImagesFrame = React.memo(styled.div`
  position: fixed;
  top: 112px; right: 161px; bottom: 0;
  width: 298px;
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
  font: 700 18px 'TT Commons';
  color: #FCFCFC; // White
  letter-spacing: .02em;
`)


const TitleText = React.memo(styled.div`
  font: 500 24px 'TT Commons';
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







{/*<div ref={divRef} onInput={onDivInput}
                 contentEditable dangerouslySetInnerHTML={{__html: divText}}/>*/}



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

/*<div
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
            </div>*/
