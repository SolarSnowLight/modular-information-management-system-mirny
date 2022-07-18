import Space from "src/components/Space";
import EyeIc from "src/components/icons/EyeIc";
import StarFilledIc from "src/components/icons/StarFilledIc";
import StarIc from "src/components/icons/StartIc";
import styled from "styled-components";
import common from 'src/common-styles/common.module.scss'
import './ArticleView.scss';
import React, {useEffect, useState} from "react";
import { ArticleApiFull } from "src/api/test/articleApiTest";
import {dateUtils} from "src/utils/dateUtils";
import {articleUtils} from "src/models/articleUtils";


const ArticleView = ({ article }: { article: ArticleApiFull }) => {

    const [htmlContent, setHtmlContent] = useState(undefined as string|undefined)
    useEffect(()=>{
        setHtmlContent(articleUtils.inlineImages(article))
    },[article])

    const date = dateUtils.from_yyyy_MM_dd_hh_mm(article.publishDate)

    const onFavorite = (article: ArticleApiFull, isFavorite = true) => {
        console.log('setFavorite', isFavorite)
    }

    if (!article) return <></>

    return <Frame className={common.column}>
            <TitleImage imageUrl={article.titleImageSrc?.getUrl()}/>
            <Space h={29}/>
            <div className={common.row}>
                { date && <BottomText>{date.day}.{date.month}.{date.year} {date.hour}:{date.minute}</BottomText> }
                <Space w={39}/>
                <div className={common.column}>
                    <BottomText>Авторы: <Blue>{article.authors}</Blue></BottomText>
                    <Space h={9}/>
                    <BottomText>Фото: <Blue>{article.photographers}</Blue></BottomText>
                </div>
                <Space flexGrow={1}/>

                <EyeIcBox className={common.center}><EyeIc fill='#8B8B8B' size={22}/></EyeIcBox>
                <Space w={10}/>
                <ViewsCnt>{article.viewsCnt}</ViewsCnt>
                <Space w={16}/>
                { article.isFavorite
                    ? <StarIcWrap onClick={()=>onFavorite(article,false)}>
                        <StarFilledIc color='#424041' size={20} />
                    </StarIcWrap>
                    : <StarIcWrap onClick={()=>onFavorite(article)}>
                        <StarIc color='#424041' size={20} />
                    </StarIcWrap>
                }

            </div>
            <Space h={29}/>
            <Title>{article.title}</Title>
            <Space h={29}/>

            {/* article-container is css class-marker*/}
            <div className='article-container' dangerouslySetInnerHTML={{ __html: htmlContent ?? '' }}/>

            <Space h={32}/>
            <div>
                { article.tags.map(it=><Tag key={it}>#{it}   </Tag>) }
            </div>

            <Space h={32} />

        </Frame>
}
export default React.memo(ArticleView)





const Frame = React.memo(styled.div`
  width: 736px;
`)
const TitleImage = React.memo(styled.div<{ imageUrl?: string }>`
  width: 100%; height: 395px;
  background-image: url("${p=>p.imageUrl}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`)
const BottomText = React.memo(styled.div`
  height: 20px;
  font: 300 15px 'TT Commons';
  color: black; 
`)
const Blue = React.memo(styled.span`
  color: #1F8DCD; // todo extract all colors
`)

const EyeIcBox = React.memo(styled.div`
  height: 20px;
`)
const ViewsCnt = React.memo(styled.div`
  min-width: 20px; height: 20px;
  font: 300 16px 'TT Commons';
  color: #8B8B8B; // Gray 2
`)
const StarIcWrap = React.memo(styled.div`
  display: contents;
  cursor: pointer;
`)

const Title = React.memo(styled.div`
  width: 90%;
  font: 500 43px 'TT Commons';
`)

const Tag = React.memo(styled.span`
  height: 20px;
  font: 300 15px 'TT Commons';
  color: black;
  white-space: break-spaces;
`)

