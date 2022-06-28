package com.rrain.springtest.filters

import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono



@Component
@Order(-100)
class CorsFilter : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val requestOrigins = try { exchange.request.headers["Origin"] } catch (e: Exception){ null } ?: listOf("*")

        //println("ORIGINS: $requestOrigins")

        exchange.response.headers.apply {
            set("Access-Control-Allow-Origin", requestOrigins.joinToString(","))
            set("Access-Control-Allow-Credentials", "true")
            //set("Access-Control-Allow-Methods", "*");
            set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS, HEAD")
            set("Access-Control-Max-Age", "3600")
            set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        }
        return chain.filter(exchange)
    }
}
