import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";
import React, {useEffect, useState} from "react";
import { ArticleApiFull } from "src/api/test/articleApiTest";
import {articleServiceTest} from "src/api-service/test/articleServiceTest";
import Header from "src/components/Header";
import ArticleView from "src/pages/ArticleView/ArticleView";




const ArticlePage = () => {

    const { articleId } = useParams()
    const nav = useNavigate()

    const [article, setArticle] = useState(undefined as ArticleApiFull|undefined)
    useEffect(()=>{(async()=>{
        if (articleId){
            let { data, error } = await articleServiceTest.getArticleById(articleId)
            if (error) {
                return
            }
            setArticle(data!.article)
        }
    })()},[articleId])

    const onEdit = () => {
        nav(`/article/${articleId}/edit`)
    }


    return <div>
        <Header>
            <div>
                <button onClick={onEdit}>Редактировать</button>
            </div>
        </Header>
        <Page>
            <ArticleFrame>
                { article && <ArticleView article={article}/> }
            </ArticleFrame>
        </Page>
    </div>
}
export default React.memo(ArticlePage)



const Page = React.memo(styled.div`
  width: 100%;
  background: #FCFCFC;
`)
const ArticleFrame = React.memo(styled.div`
  width: fit-content;
  padding: 20px;
  margin: auto;
`)


