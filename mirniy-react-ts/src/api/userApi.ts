import Axios, {AxiosResponse} from "axios"

const ip = 'localhost'
const port = '8000'
const basePath = ""
const baseUrl = `http://${ip}:${port}/${basePath}`

const ax = Axios.create({
    baseURL: baseUrl,
    withCredentials: true
})



// 400
export type BadRequest = {
    message?: string
}
// 404
export type NotFound = BadRequest
// 500
export type InternalServerError = BadRequest
// default
export type Default = BadRequest


type ResponseData<D> = Promise<AxiosResponse<D|BadRequest>>


// 200
export type AuthResponse = {
    access_token: string
    refresh_token: string
}
const login = async (
    login: string, password: string
): ResponseData<AuthResponse> => {
    return ax.post("auth/sign-in", {
        email: login,
        password: password,
    })
}


// 200
export type LogoutResponse = {
    is_logout: boolean
}
const logout = async (
    accessToken: string|null|undefined, refreshToken: string|null|undefined
): ResponseData<LogoutResponse> => {
    return ax.post('auth/logout', {
        access_token: accessToken,
        refresh_token: refreshToken,
    })
}


export type UserRegister = {
    email: string
    password: string
    name: string
    surname: string
}
const signup = async (userData: UserRegister): ResponseData<AuthResponse> => {
    return ax.post('auth/sign-up',{
        ...userData
    })
}


export const userApi = {
    login,
    logout,
    signup,
}