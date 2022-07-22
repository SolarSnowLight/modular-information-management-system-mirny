package com.rrain.springtest.controllers

import com.rrain.springtest.entities.Image
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.io.path.readBytes


@RestController
class ImageController {



    @GetMapping(
        value = ["/image"],
        //produces = [MediaType.IMAGE_JPEG_VALUE],
        produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE], // for raw data
    )
    fun getImage(@RequestParam path: String): ResponseEntity<*> {
        return ResponseEntity.ok(Image(path=path).getAbsPath()?.readBytes())
    }


}