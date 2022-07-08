import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import common from 'src/common-styles/common.module.scss'
import './ArticleView.scss';
import React, {useEffect, useMemo, useState} from "react";
import {ArticleApi} from "src/api/articleApiMock";
import {articleService} from "src/service/articleService";
import {API_URL_2} from "../../api/ax2";
import {dateUtils} from "src/utils/dateUtils";
import Space from "src/components/Space";
import EyeIc from "src/components/icons/EyeIc";
import StarFilledIc from "src/components/icons/StartFilledIc";
import StarIc from "src/components/icons/StartIc";
import Header from "src/components/Header";



// todo add regexp to check article content


const Article = () => {

    const { articleId } = useParams()
    const nav = useNavigate()

    const [article, setArticle] = useState(undefined as ArticleApi|undefined)
    useEffect(()=>{(async()=>{
        if (articleId){
            let { data, error } = await articleService.getArticleById(articleId)
            if (error) return
            setArticle(data!.article)
        }
    })()},[articleId])

    const a = useMemo(()=>{
        if (article) {
            const titleImgUrl = new URL(article.titleImage.image.url)

            const date = dateUtils.from_yyyy_MM_dd_hh_mm(article.publishDate)

            return {
                titleImgUrl,
                date,
            }
        }
    },[article])

    const onFavorite = (article: ArticleApi, isFavorite = true) => {
        console.log('onFavorite', isFavorite)
    }
    /*const onEdit = () => {
        nav(`/article/${articleId}/edit`)
    }*/

    if (!article || !a) return <>Статья не загружена</>



    return <div>
        <Header>
            <div>
                {/*<button onClick={onEdit}>Редактировать</button>*/}
            </div>
        </Header>
        <Page>
            <ArticleFrame>
                <Frame className={common.column}>
                    <TitleImage imageUrl={a.titleImgUrl}/>
                    <Space h={29}/>
                    <div className={common.row}>
                        <BottomText>{a.date.day}.{a.date.month}.{a.date.year} {a.date.hour}:{a.date.minute}</BottomText>
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

                    {/* css class-marker article-container */}
                    <div className='article-container' dangerouslySetInnerHTML={{ __html: article.content }}/>

                    <Space h={32}/>
                    <div>
                        { article.tags.map(it=><Tag key={it}>#{it}   </Tag>) }
                    </div>

                    <Space h={32} />

                </Frame>
            </ArticleFrame>
        </Page>
    </div>
}
export default React.memo(Article)



const Page = React.memo(styled.div`
  width: 100%;
  background: #FCFCFC;
`)
const ArticleFrame = React.memo(styled.div`
  width: fit-content;
  padding: 20px;
  margin: auto;
`)
const Frame = React.memo(styled.div`
  width: 736px;
`)
const TitleImage = React.memo(styled.div<{ imageUrl: URL }>`
  width: 100%; height: 395px;
  background-image: url("${p=>p.imageUrl+''}");
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





