import common from 'src/styles/common.module.scss'
import React, {useEffect, useState} from "react";
import ArticleCard from "./sub-components/ArticleCard";
import styled from "styled-components";
import {articleService} from "src/api-service/articleService";
import {Article} from "src/api-service/articleServiceUtils";





function ArticleList(){

    const [articles, setArticles] = useState(undefined as Article[]|undefined)

    useEffect(()=>{(async()=>{
        const r = await articleService.getUserArticles()
        if (r.type==='error') {
            console.log(r.error)
            return
        }
        setArticles(r.data.articles)
    })()},[])

    //console.log(articles)

    return <MainFrame className={common.col}>
        { articles && articles.map(it=><ArticleCard key={it.id} article={it} />) }
    </MainFrame>
}
export default React.memo(ArticleList)

const MainFrame = React.memo(styled.div`
  padding: 20px;
  gap: 20px;
`)



