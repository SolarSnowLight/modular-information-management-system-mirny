import css from './ArticleList.module.scss'
import {useEffect} from "react";
import {articleActions} from "../../redux/articleReducer";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {ArticleApi} from "../../api/articleApiMock";
import {API_URL_2} from "../../api/ax2";
import styled from "styled-components";
import Space from "../../components/Space";
import EyeIc from "../../components/icons/EyeIc";
import StarIc from "../../components/icons/StartIc";
import StarFilledIc from "../../components/icons/StartFilledIc";
import { Link } from 'react-router-dom';





function ArticleList(){

    const d = useAppDispatch()
    const { articles } = useAppSelector(s=>s.articles)
    const { articles: error } = useAppSelector(s=>s.errors)
    const { articles: loading } = useAppSelector(s=>s.loading)

    useEffect(()=>{
        d(articleActions.loadArticles())
    },[])

    const onFavorite = (article: ArticleApi, isFavorite = true) => {
        console.log('onFavorite', isFavorite)
    }



    return <div className={css.mainFrame}>
        {
            error.common.length > 0 &&
            <div>
                <span>Email error: </span>
                <span>code: </span>
                <span style={{color: 'red'}}>{error.common[0].code} </span>
                <span>message: </span>
                <span style={{color: 'red'}}>{error.common[0].message} </span>
            </div>
        }
        { articles?.map(it=><ArticleCard key={it.id} article={it} onFavorite={onFavorite}/>) }
    </div>
}
export default ArticleList



const Title = styled.div`
  height: 26px;
  font: 600 22px 'TT Commons';
  color: #FCFCFC; // White
  overflow: hidden;
`
const Description = styled.div`
  height: 46px;
  font: 300 18px 'TT Commons';
  color: #FCFCFC; // White
  overflow: hidden;
`
const Divider = styled.div`
  width: 100%; height: 1.2px;
  background: rgba(139, 139, 139, 0.5);
`
const BottomText = styled.div`
  height: 20px;
  font: 300 16px 'TT Commons';
  color: #FCFCFC; // White
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



const ArticleCard = (
    { article, onFavorite }:
        {
            article: ArticleApi,
            onFavorite: (article: ArticleApi, isFavorite?: boolean)=>void
        }
) => {

    //const titleImgUrl = API_URL_2+'image?path='+article.titleImage.image.path
    const titleImgUrl = new URL(API_URL_2+'image')
    titleImgUrl.searchParams.append('path', article.titleImage.image.path)
    //console.log(titleImgUrl)

    return <div className={css.card}>
        <div className={css.content}>
            <Link to={`/article/${article.id}`}><Title>{article.title}</Title></Link>
            <Description>{article.shortDescription}</Description>
            <Divider/>
            <div className={css.cardBottom}>
                <BottomText>{article.theme}</BottomText>
                <Space w={10}/>
                <BottomText>{article.publishDate.substring(8,10)}.{article.publishDate.substring(5,7)}</BottomText>
                <Space flexGrow={1} />
                <div className={css.eyeIcBox}><EyeIc fill='#8B8B8B' size={22}/></div>
                <Space w={10}/>
                <ViewsCnt>{article.viewsCnt}</ViewsCnt>
                <Space w={20}/>
                { article.isFavorite
                    ? <StarIcWrap onClick={()=>onFavorite(article,false)}>
                            <StarFilledIc color='#FCFCFC' size={20} />
                      </StarIcWrap>
                    : <StarIcWrap onClick={()=>onFavorite(article)}>
                            <StarIc color='#FCFCFC' size={20} />
                      </StarIcWrap>
                }
            </div>
        </div>
        <div className={css.photo}
             style={{backgroundImage: `url(${titleImgUrl})`}}/>
    </div>
}