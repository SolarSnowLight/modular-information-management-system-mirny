package com.rrain.springtest.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
class SecurityConfig {



    @Bean
    @Throws(Exception::class)
    fun webSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        http.run {
            csrf { it.disable() }
            httpBasic { it.disable() }
            authorizeExchange {
                // чем выше запись - тем приоритетнее
                //it.antMatchers("/spring/hello").denyAll()
                it.anyExchange().permitAll()
            }
            /*
            todo it is not here
            sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
             */
        }
        return http.build()
    }


}