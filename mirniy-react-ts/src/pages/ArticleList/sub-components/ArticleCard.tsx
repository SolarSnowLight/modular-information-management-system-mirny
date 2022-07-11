import common from 'src/common-styles/common.module.scss'
import {Article, ArticleApi} from "src/api/articleApiTest";
import {Link} from "react-router-dom";
import Space from "src/components/Space";
import EyeIc from "src/components/icons/EyeIc";
import StarFilledIc from "src/components/icons/StarFilledIc";
import StarIc from "src/components/icons/StartIc";
import styled from "styled-components";
import {dateUtils} from "src/utils/dateUtils";
import React from "react";





const ArticleCard = (
    { article }: { article: Article }
) => {
    const date = dateUtils.from_yyyy_MM_dd_hh_mm(article.publishDate)

    const onFavorite = (article: ArticleApi, isFavorite = true) => {
        console.log('setFavorite', isFavorite)
    }

    return <Card className={common.row}>
        <Content className={common.column}>
            <Link to={`/article/${article.id}`}><Title>{article.title}</Title></Link>
            <Description>{article.shortDescription}</Description>
            <Divider/>
            <div className={common.row}>
                <BottomText>{article.theme}</BottomText>
                <Space w={10}/>
                { date && <BottomText>{date.day}.{date.month}</BottomText> }
                <Space flexGrow={1} />
                <EyeIcBox className={common.center}><EyeIc fill='#8B8B8B' size={22}/></EyeIcBox>
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
        </Content>
        <Photo imageUrl={article.titleImageSrc?.getUrl()} />
    </Card>
}
export default React.memo(ArticleCard)


const Card = React.memo(styled.div`
  width: 613px; height: 171px;
  background: #424041; // Gray1 todo extract
  border-radius: 4px;
  overflow: hidden;
`)
const Content = React.memo(styled.div`
  flex-grow: 1; height: 100%;
  padding: 16px;
  justify-content: space-between;
`)
const Title = React.memo(styled.div`
  height: 26px;
  font: 600 22px 'TT Commons';
  color: #FCFCFC; // White
  overflow: hidden;
`)
const Description = React.memo(styled.div`
  height: 46px;
  font: 300 18px 'TT Commons';
  color: #FCFCFC; // White
  overflow: hidden;
`)
const Divider = React.memo(styled.div`
  width: 100%; height: 1.2px;
  background: rgba(139, 139, 139, 0.5);
`)
const BottomText = React.memo(styled.div`
  height: 20px;
  font: 300 16px 'TT Commons';
  color: #FCFCFC; // White
`)
const EyeIcBox = React.memo(styled.div`
  height: 20px;
`)
const ViewsCnt = React.memo(styled.div`
  min-width: 20px; height: 20px;
  font: 300 16px 'TT Commons';
  color: #8B8B8B; // Gray 2 // todo extract color
`)
const StarIcWrap = React.memo(styled.div`
  display: contents;
  cursor: pointer;
`)
const Photo = React.memo(styled.div<{ imageUrl: string }>`
  aspect-ratio: 1; height: 100%;
  background-image: url("${p=>p.imageUrl}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`)
