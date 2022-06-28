import {useParams} from "react-router-dom";
import styled from "styled-components";
import common from 'src/common-styles/common.module.scss'
import {useEffect, useMemo, useState} from "react";
import {ArticleApi} from "src/api/articleApiMock";
import {articleService} from "src/service/articleService";
import {API_URL_2} from "../../api/ax2";
import {dateUtils} from "../../utils/dateUtils";
import Space from "../../components/Space";
import EyeIc from "../../components/icons/EyeIc";
import StarFilledIc from "../../components/icons/StartFilledIc";
import StarIc from "../../components/icons/StartIc";


const Article = () => {

    const { articleId } = useParams()

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
            const titleImgUrl = new URL(API_URL_2+'image')
            titleImgUrl.searchParams.append('path', article.titleImage.image.path)

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

    if (!article || !a) return <>Статья не загружена</>



    return <OuterFrame>
        <ArticleFrame>
            <Frame className={common.column}>
                <TitleImage imageUrl={a.titleImgUrl}/>
                <Space h={29}/>
                <div className={common.row}>
                    <BottomText>{a.date.day}.{a.date.month}.{a.date.year} {a.date.hour}:{a.date.minute}</BottomText>
                    <Space w={39}/>
                    <div className={common.column}>
                        <BottomText>Авторы: {article.authors}</BottomText>
                        <Space h={9}/>
                        <BottomText>Фото: {article.photographers}</BottomText>
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

                <ArticleText dangerouslySetInnerHTML={{ __html: article.text }}/>

            </Frame>
        </ArticleFrame>
    </OuterFrame>
}
export default Article



const OuterFrame = styled.div`
  width: fit-content;
  margin: auto;
`
const ArticleFrame = styled.div`
  width: fit-content;
  padding: 20px;
  background: #FCFCFC;
`
const Frame = styled.div`
  width: 1112px;
`
const TitleImage = styled.div<{ imageUrl: URL }>`
  width: 100%; height: 395px;
  background-image: url("${p=>p.imageUrl+''}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`
const BottomText = styled.div`
  height: 20px;
  font: 300 15px 'TT Commons';
  color: black; 
`

const EyeIcBox = styled.div`
  height: 20px;
`
const ViewsCnt = styled.div`
  min-width: 20px; height: 20px;
  font: 300 16px 'TT Commons';
  color: #8B8B8B; // Gray 2
`
const StarIcWrap = styled.div`
  display: contents;
  cursor: pointer;
`

const Title = styled.div`
  width: 60%;
  font: 500 43px 'TT Commons';
`

const ArticleText = styled.div`
  h3 {
    font: 500 29px 'TT Commons';
    color: black;
    padding-bottom: 10px;
  }
  p {
    font: 400 16px 'TT Commons';
    color: black;
    padding-bottom: 10px;
    white-space: pre-wrap;
  }
`

