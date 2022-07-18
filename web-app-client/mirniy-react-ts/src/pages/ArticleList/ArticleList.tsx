import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useState} from "react";
import ArticleCard from "./sub-components/ArticleCard";
import styled from "styled-components";
import {Article, articleService} from "src/api-service/articleService";





function ArticleList(){

    const [articles, setArticles] = useState(undefined as Article[]|undefined)

    useEffect(()=>{(async()=>{
        let { data, error } = await articleService.getUserArticles()
        if (error) {
            console.log(error)
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



