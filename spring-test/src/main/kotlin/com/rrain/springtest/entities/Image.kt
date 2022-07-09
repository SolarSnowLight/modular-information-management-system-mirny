package com.rrain.springtest.entities

import com.rrain.springtest.utils.PathProvider


class Image(

    var id: Int? = null,

    var path: String? = null, // relative path to image

) {
    fun getAbsPath() = path?.let{ PathProvider.absPath.resolve("src/main/resources/images").resolve(it) }

    fun getUrl() = path?.let { imgUrlPrefix+it }

    override fun toString(): String {
        return "Image(id=$id, path=$path)"
    }

    companion object {
        const val imgUrlPrefix = "http://localhost:8081/image?path="
    }
}