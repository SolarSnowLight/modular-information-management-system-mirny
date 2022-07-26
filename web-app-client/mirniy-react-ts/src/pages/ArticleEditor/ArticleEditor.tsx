

import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "src/redux/reduxHooks";
import styled from "styled-components";
import Space from "src/components/Space";
import Input1 from "src/components/Input1";
import Button1 from "src/components/Button1";
import {lastFocused} from "src/utils/documentUtils";
import {DateTime} from "src/utils/DateTime";
import Popup from "src/components/Popup";
import ArticleView from "src/pages/ArticleView/ArticleView";
import TitleImage from "./sub-components/TitleImage";
import {joinTags, splitTags, walkFileTree} from "src/utils/utils";
import {IdGenerator} from "src/models/IdGenerator";
import ListImage from './sub-components/ListImage';
import {articleUtils} from "src/models/articleUtils";
import {Article, ArticleImage, articleService, Image} from "src/api-service/articleService";
import {useNavigate, useParams} from "react-router-dom";
import {nonEmpty} from "@rrainpath/ts-utils";
import TitleImage2 from "./sub-components/TitleImage2";





const imageExtensions = /\.((jpg)|(jpeg)|(png)|(webp)|(bmp)|(jfif))$/i
const wordExtensions = /\.((doc)|(docx))$/i




const ArticleEditor = () => {

    const { articleId } = useParams()
    const nav = useNavigate()

    useEffect(()=>{(async()=>{
        if (articleId){
            let { data, error } = await articleService.getArticleById(articleId)
            if (error) {
                return
            }
            const a = data!.article
            setTitle(a.title ?? '')
            setRawText(articleUtils.unwrapP(a.text??''))
            setTags(joinTags(a.tags))
            setImages(a.images.map(it=>{
                if (it.props.isTitle){
                    it = it.clone()
                    it.props.isTitleNew = true
                }
                return it
            }))
            setIdGen(new IdGenerator(a.images.map(it=>it.localId)))
        }
    })()},[articleId])

    const d = useAppDispatch()
    const { isDraggingFiles } = useAppSelector(s=>s.app)

    const [idGen, setIdGen] = useState(()=>new IdGenerator())

    const [title, setTitle] = useState('')
    const onTitleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(ev.currentTarget.value)
    }

    const [tags, setTags] = useState('')
    const onTagsInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTags(ev.currentTarget.value)
    }

    const [rawText, setRawText] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const onTextInput = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRawText(ev.currentTarget.value)
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


    const [images, setImages] = useState([] as ArticleImage[])
    //const [word, setWord] = useState(undefined as undefined|File)

    const getTitleImage = () => images.find(it=>it.props.isTitleNew)
    const setTitleImage = (articleImage: ArticleImage) => {
        //console.log('setTitleImage', articleImage)
        setImages(images=>images.map(it=>{
            if (it.props.isTitleNew){
                it = it.clone()
                it.props.isTitleNew = false
            }
            if (it===articleImage){
                it = it.clone()
                it.props.isTitleNew = true
            }
            return it
        }))
    }

    const addFile = async (file: File): Promise<ArticleImage|undefined> => {
        if (imageExtensions.test(file.name)){
            const newIm = await Image.fromFile(file)
            const newAIm = new ArticleImage(idGen.getId(), newIm, { isNew: true })
            setImages(images=>[...images, newAIm])
            return newAIm
        }
        else if (wordExtensions.test(file.name)){
            //setWord(file)
        }
    }

    const onFilesDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        if (isDraggingFiles) {
            for (const item of ev.dataTransfer.items){
                const fsItem = item.webkitGetAsEntry()
                walkFileTree(fsItem, addFile)
            }
        }
    }

    const onRemove = (articleImage: ArticleImage) => {
        setImages(images.map(it=>{
            if (it===articleImage){
                it = it.clone()
                it.image = undefined
                it.updateProps({ isTitleNew: false, isTextNew: false, isDeleted: true })
            }
            return it
        }))
    }

    const onTextImagePaste = (articleImage: ArticleImage) => {
        const area = textareaRef.current
        if (area){
            const s = area.selectionStart
            const oldLen = rawText.length
            const newText = rawText.substring(0,s)+`${"\n"}<article-image localId="${articleImage.localId}"/>${"\n"}`+rawText.substring(s)
            setRawText(newText)
            const newSel = s+(newText.length-oldLen)
            setNewSelection({s: newSel, e: newSel})
            area.focus()
        }
    }
    const onTitleImagePaste = (articleImage: ArticleImage) => {
        setTitleImage(articleImage)
    }

    const onImagePaste = (articleImage: ArticleImage) => {
        const area = textareaRef.current
        if (area && lastFocused === area){
            onTextImagePaste(articleImage)
            return
        }
        const titleImageFrame = titleImageFrameRef.current
        if (titleImageFrame && lastFocused === titleImageFrame){
            onTitleImagePaste(articleImage)
            return
        }
    }

    const [builtArticle, setBuiltArticle] = useState(undefined as Article|undefined)

    const onPreview = () => {
        const article = prepareArticleForPreview()
        setBuiltArticle(article)
    }

    const prepareArticleForPreview = (): Article|undefined => {
        const text = articleUtils.wrapWithP(rawText)
        const textImIds = articleUtils.getUsedImageLocalIds(text)

        const imgs = images
            .map(it=>{
                const newAIm = it.clone()
                const isTitle = it.props.isTitleNew
                const isText = textImIds.includes(newAIm.localId)
                newAIm.updateProps({
                    isTitle: isTitle,
                    isText: isText,
                    isTitleNew: isTitle,
                    isTextNew: isText
                })
                return newAIm
            })
            .filter(it=>it.props.isTitle || it.props.isText)

        const createdAt = DateTime.fromDate(new Date()).to_yyyy_MM_dd_HH_mm()
        const updatedAt = DateTime.fromDate(new Date()).to_yyyy_MM_dd_HH_mm()

        return new Article(
            articleId,
            title,
            undefined,
            undefined,
            createdAt,
            updatedAt,
            splitTags(tags),
            undefined,
            undefined,
            text,
            imgs,
            99,
            false,
        )
    }


    const onSave = async () => {
        const a = prepareArticleForSave()
        //console.log(a)
        if (a){
            let { data, error } = await articleService.saveArticle(a)
            if (error) {
                console.log(error)
                return
            }
            if (data!.result==='saved'){
                nav('/articles/user')
            }
            else if (data!.result==='updated'){
                nav(`/article/${a.id}`)
            }
        }
    }
    const prepareArticleForSave = (): Article|undefined => {
        const text = articleUtils.wrapWithP(rawText)
        const textImIds = articleUtils.getUsedImageLocalIds(text)

        const imgs = images
            .map(it=>{
                const newAIm = it.clone()
                const isTitleNew = it.props.isTitleNew
                const isTextNew = textImIds.includes(newAIm.localId)
                newAIm.updateProps({
                    isTitleNew: isTitleNew,
                    isTextNew: isTextNew
                })
                return newAIm
            })

        return new Article(
            articleId,
            title,
            undefined,
            undefined,
            undefined,
            undefined,
            splitTags(tags),
            undefined,
            undefined,
            text,
            imgs,
            0,
            false,
        )
    }



    return <Page>

        { builtArticle && <Popup onClose={()=>setBuiltArticle(undefined)}>
            <ArticlePreviewCard>
                <ArticleView article={builtArticle}/>
                <Space h={35}/>
                <ActionButton onClick={onSave}>Сохранить</ActionButton>
            </ArticlePreviewCard>
        </Popup> }

        <ImagesFrame onDrop={onFilesDrop}>

            { images.length > 0 && <ImagesList className={common.column}>
                <TitleForImages>Изображения</TitleForImages>
                { images.filter(it=>!it.props.isDeleted).map(it=>
                    <ListImage articleImage={it} key={it.localId}
                               onRemove={onRemove} onPaste={onImagePaste}
                               onTitleImagePaste={onTitleImagePaste} onTextImagePaste={onTextImagePaste}
                />) }
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
{/*

            <Space h={35}/>

            <TitleImage ref={titleImageFrameRef} tabIndex={0} articleImage={getTitleImage()} />
*/}

            <Space h={35}/>

            <TitleImage2 articleImage={getTitleImage()} setTitleImage={setTitleImage} onFile={addFile} />

            <Space h={35}/>

            <TitleText>Текст статьи</TitleText>

            <Space h={35}/>

            <TextArea ref={textareaRef} value={rawText} onInput={onTextInput} />

            <Space h={35}/>

            <Input1 h={60} title='Теги' placeholder='#тег1 #тег2 #тег3'
                    value={tags} onInput={onTagsInput}
                    titleFont='TT Commons' titleColor='#424041'
                    placeholderFont='TT Commons' placeholderColor='#8B8B8B'
                    textFont='TT Commons' textColor='black'
                    borderColor='#8B8B8B'
            />

            <Space h={35}/>

            <ActionButton onClick={onPreview}>Предпросмотр</ActionButton>

        </ArticleFrame>

    </Page>

}
export default React.memo(ArticleEditor)


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
  padding: 14px;
  font: 400 18px 'TT Commons';
  color: black;
  resize: vertical;
`)

const ActionButton = styled(Button1)`
  width: 138px; height: 42px;
  font: 600 18px "TT Commons";
`







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
