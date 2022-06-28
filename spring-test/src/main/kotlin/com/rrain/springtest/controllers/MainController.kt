package com.rrain.springtest.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class MainController {

    @GetMapping("/spring/hello")
    fun helloSpring() = "Hello Spring!!!"

}