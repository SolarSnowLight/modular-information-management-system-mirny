package com.rrain.springtest.entities.article

import com.rrain.springtest.repos.ArticleRepo
import org.jsoup.Jsoup
import org.jsoup.parser.Parser



class Article(
    var id: Int? = null,

    var title: String? = null,
    var titleImageLocalId: Int? = null,
    var theme: String? = null,
    var shortDescription: String? = null,
    var publishDate: String? = null,
    var tags: MutableList<String> = mutableListOf(),

    var authors: String? = null,
    var photographers: String? = null,

    var text: String? = null,

    var imageIds: MutableList<Int> = mutableListOf(),

    var viewsCnt: Int? = null,
    var isFavorite: Boolean? = null,
) {



}


// todo extract to my test tutorials
/*

    var text = text
        set(value){
            htmlContent = null
            field = value
        }

    var htmlContent: String? = null
        get(){
            val t = text
            if (field==null && t!=null) {
                val document = Jsoup.parse(t, "", Parser.xmlParser())

                // replacing custom tag <article-image /> by <img />
                val elements = document.select("article-image")
                elements.forEach {
                    // <img src="localId=2" style="display: block; width: 100%; height: 300px; object-fit: cover;"/>
                    var src = it.attr("localId")
                    src = ArticleRepo.articleImages[id]!!
                        .find { it.localId==src.toIntOrNull() }!!
                        .imageId!!
                        .let { ArticleRepo.images[it]!! }
                        .getUrl()!!
                    val img = Jsoup.parseBodyFragment(
                        """<img src="$src" style="display: block; width: 100%; height: 300px; object-fit: cover;"/>"""
                    ).select("img")[0]
                    it.replaceWith(img)
                }

                // removing <script></script> tags
                document.select("script").remove()

                field = document.toString()
            }
            return field
        }
*/


// OLD
/*val content: String get(){
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
        when(type){
            "path" -> it.attr("src", Image.imgUrlPrefix+value)
            "localId" -> it.attr("src",
                Image.imgUrlPrefix +
                ArticleRepo.articleImages[id]!!
                    .find { it.localId==value.toIntOrNull() }!!
                    .imageId!!
                    .let { ArticleRepo.images[it]!! }
                    .path
            )
        }
    }

    document.select("script").remove()

    c = document.body().html()
    return c
}*/
