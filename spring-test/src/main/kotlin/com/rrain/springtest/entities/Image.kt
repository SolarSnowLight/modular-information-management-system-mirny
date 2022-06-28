package com.rrain.springtest.entities

import com.rrain.springtest.utils.PathProvider

class Image(

    var id: Int? = null,

    var path: String? = null, // relative path to image

) {
    fun getAbsPath() = path?.let{ PathProvider.absPath.resolve("src/main/resources/images").resolve(it) }

    override fun toString(): String {
        return "Image(id=$id, path=$path)"
    }
}