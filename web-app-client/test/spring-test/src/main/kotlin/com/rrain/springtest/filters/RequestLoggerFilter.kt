package com.rrain.springtest.filters

import com.rrain.springtest.utils.logger
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import org.springframework.web.util.UriUtils
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets
import java.util.concurrent.atomic.AtomicInteger


@Component
@Order(-101)
class RequestLoggerFilter : WebFilter {
    private val log = logger()
    private val requestCnt = AtomicInteger(0)

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        val requestNumber = requestCnt.getAndIncrement()
        val uri = exchange.request.uri
        val uriOriginal = uri.toString()
        val uriDecoded = UriUtils.decode(uriOriginal, StandardCharsets.UTF_8)
        log.info("Request #$requestNumber: $uriDecoded (original: $uriOriginal)")
        return chain.filter(exchange)
    }
}