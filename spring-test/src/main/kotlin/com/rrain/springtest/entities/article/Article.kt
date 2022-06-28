package com.rrain.springtest.entities.article

class Article(
    var id: Int? = null,

    var title: String? = null,
    var titleImageId: Int? = null,
    var theme: String? = null,
    var shortDescription: String? = null,

    var authors: String? = null,
    var photographers: String? = null,

    var publishDate: String? = null,
    var viewsCnt: Int? = null,
    var isFavorite: Boolean? = null,

    var text: String? = null,
    var imageIds: MutableList<Int> = mutableListOf(),
) {

}