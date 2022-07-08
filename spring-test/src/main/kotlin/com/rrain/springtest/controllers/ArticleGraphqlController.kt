package com.rrain.springtest.controllers

import com.rrain.springtest.entities.Image
import com.rrain.springtest.entities.article.Article
import com.rrain.springtest.entities.article.ArticleImage
import com.rrain.springtest.repos.ArticleRepo
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.BatchMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller

@Controller
class ArticleGraphqlController {


    @QueryMapping
    suspend fun articles(): List<Article> {
        return ArticleRepo.articles.values.toList()
    }
    @QueryMapping
    suspend fun article(@Argument id: Int?): Article? {
        return ArticleRepo.articles.values.singleOrNull { it.id===id }
    }



    /*@BatchMapping("titleImage")
    suspend fun articleImageOfArticle(articles: List<Article>): Map<Article, ArticleImage> {
        return articles.associateWith { ArticleRepo.articleImages[it.titleImageLocalId]!! }
    }*/
    @BatchMapping("titleImage")
    fun articleImageOfArticle(articles: List<Article>): List<ArticleImage> {
        return articles.map { a -> ArticleRepo.articleImages[a.id]!!.find { it.localId==a.titleImageLocalId }!! }
    }

    /*@BatchMapping("images")
    fun articleImagesOfArticle(articles: List<Article>): List<List<ArticleImage>> {
        return articles.map { it.imageIds.map { ArticleRepo.articleImages[it]!! } }
    }*/
    @BatchMapping("images")
    fun articleImagesOfArticle(articles: List<Article>): List<List<ArticleImage>> {
        return articles.map { ArticleRepo.articleImages[it.id]!! }
    }

    @BatchMapping("image")
    fun imageOfArticleImage(articleImages: List<ArticleImage>): List<Image> {
        return articleImages.map { ArticleRepo.images[it.imageId]!! }
    }


}



/*
// usual fun: List<*> or Flux<*> OR suspend fun: Map<*,*>
@BatchMapping("image")
fun imageOfArticleImage(articleImages: List<ArticleImage>): List<Image> {
    return articleImages.map { ArticleRepo.images[it.imageId]!! }
}
@BatchMapping("image")
fun imageOfArticleImage(articleImages: List<ArticleImage>): Flux<Image> {
    return articleImages.map { ArticleRepo.images[it.imageId]!! }.let { Flux.fromIterable(it) }
}
@BatchMapping("image")
suspend fun imageOfArticleImage(articleImages: List<ArticleImage>): Map<ArticleImage, Image> {
    return articleImages.associateWith { ArticleRepo.images[it.imageId]!! }
}
*/