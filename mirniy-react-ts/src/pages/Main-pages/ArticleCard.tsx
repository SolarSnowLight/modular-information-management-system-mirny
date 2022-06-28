import common from 'src/common-styles/common.module.scss'
import {ArticleApi} from "src/api/articleApiMock";
import {API_URL_2} from "src/api/ax2";
import {Link} from "react-router-dom";
import Space from "src/components/Space";
import EyeIc from "src/components/icons/EyeIc";
import StarFilledIc from "src/components/icons/StartFilledIc";
import StarIc from "src/components/icons/StartIc";
import styled from "styled-components";





const ArticleCard = (
    { article, onFavorite }:
        {
            article: ArticleApi,
            onFavorite: (article: ArticleApi, isFavorite?: boolean)=>void
        }
) => {
    const titleImgUrl = new URL(API_URL_2+'image')
    titleImgUrl.searchParams.append('path', article.titleImage.image.path)


    return <Card className={common.row}>
        <Content className={common.column}>
            <Link to={`/article/${article.id}`}><Title>{article.title}</Title></Link>
            <Description>{article.shortDescription}</Description>
            <Divider/>
            <div className={common.row}>
                <BottomText>{article.theme}</BottomText>
                <Space w={10}/>
                <BottomText>{article.publishDate.substring(8,10)}.{article.publishDate.substring(5,7)}</BottomText>
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
        <Photo imageUrl={titleImgUrl} />
    </Card>
}
export default ArticleCard


const Card = styled.div`
  width: 613px; height: 171px;
  background: #424041; // Gray1 todo extract
  border-radius: 4px;
  overflow: hidden;
`
const Content = styled.div`
  flex-grow: 1; height: 100%;
  padding: 16px;
  justify-content: space-between;
`
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
const Photo = styled.div<{ imageUrl: URL }>`
  aspect-ratio: 1; height: 100%;
  background-image: url("${p=>p.imageUrl+''}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`
