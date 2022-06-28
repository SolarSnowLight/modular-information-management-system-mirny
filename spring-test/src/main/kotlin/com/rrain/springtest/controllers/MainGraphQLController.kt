package com.rrain.springtest.controllers

import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller


@Controller
class MainGraphQLController {

    @QueryMapping
    suspend fun helloGraphQL() = "Hello GraphQL!!!"


}