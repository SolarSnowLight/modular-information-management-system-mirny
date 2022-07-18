import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useState} from "react";
import { ArticleApiFull } from "src/api/test/articleApiTest";
import {articleServiceTest} from "src/api-service/test/articleServiceTest";
import ArticleCard from "./sub-components/ArticleCard";
import styled from "styled-components";





function ArticleList(){

    const [articles, setArticles] = useState(undefined as ArticleApiFull[]|undefined)

    useEffect(()=>{(async()=>{
        let { data, error } = await articleServiceTest.getArticles()
        if (error) {
            return
        }
        setArticles(data!.articles)
    })()},[])


    return <MainFrame className={common.column}>
        { articles && articles.map(it=><ArticleCard key={it.id} article={it} />) }
    </MainFrame>
}
export default React.memo(ArticleList)

const MainFrame = React.memo(styled.div`
  padding: 20px;
  gap: 20px;
`)



