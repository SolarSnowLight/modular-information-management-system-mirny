import jwtUtils from 'jsonwebtoken'

type TokenContent = {
    exp: number
    iat: number
    users_id: string
    roles_id: string
    auth_types_id: string
}

export  function decodeJwt<C extends {} = TokenContent>(jwt: string): C {
    return jwtUtils.decode(jwt, { json: true }) as C
}