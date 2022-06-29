package com.rrain.springtest.entities.article

import com.rrain.springtest.repos.ArticleRepo
import org.jsoup.Jsoup
import java.lang.Integer.max



class Article(
    var id: Int? = null,

    var title: String? = null,
    var titleImageId: Int? = null,
    var theme: String? = null,
    var tags: MutableList<String> = mutableListOf(),
    var shortDescription: String? = null,

    var authors: String? = null,
    var photographers: String? = null,

    var publishDate: String? = null,
    var viewsCnt: Int? = null,
    var isFavorite: Boolean? = null,

    var text: String? = null,
    var imageIds: MutableList<Int> = mutableListOf(),
) {


    val content: String get(){
        var c = text ?: ""

        //val document = Jsoup.parse(c)
        val document = Jsoup.parseBodyFragment(c)
        document.outputSettings().prettyPrint(false)

        val elementsByAttr = document.select("img[src]")
        elementsByAttr.forEach {
            val srcContent = it.attr("src")
            val (type,value) = srcContent.let {
                val eqIdx = it.indexOf('=')
                it.substring(0, max(0,eqIdx)) to it.substring(eqIdx+1)
            }
            if (type=="path"){
                it.attr("src", ArticleRepo.imgPathPrefix+value)
            }
        }

        document.select("script").remove()

        c = document.body().html()
        return c
    }


}