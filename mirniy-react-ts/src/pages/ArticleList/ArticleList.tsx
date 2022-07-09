import common from 'src/common-styles/common.module.scss'
import React, {useEffect, useState} from "react";
import {ArticleApi} from "../../api/articleApiTest";
import {articleService} from "../../service/articleService";
import ArticleCard from "./sub-components/ArticleCard";
import styled from "styled-components";





function ArticleList(){

    const [articles, setArticles] = useState(undefined as ArticleApi[]|undefined)

    useEffect(()=>{(async()=>{
        let { data, error } = await articleService.getArticles()
        if (error) return
        setArticles(data!.articles)
    })()},[])


    const onFavorite = (article: ArticleApi, isFavorite = true) => {
        console.log('onFavorite', isFavorite)
    }


    if (!articles) return <>Статьи не загружена</>

    return <MainFrame className={common.column}>
        { articles.map(it=><ArticleCard key={it.id} article={it} onFavorite={onFavorite}/>) }
    </MainFrame>
}
export default React.memo(ArticleList)

const MainFrame = React.memo(styled.div`
  padding: 20px;
  gap: 20px;
`)



