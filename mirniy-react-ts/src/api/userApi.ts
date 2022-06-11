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



// 200
export type LoginResponse = {
    access_token: string
    refresh_token: string
}
const login = async (login: string, password: string): Promise<AxiosResponse<LoginResponse|BadRequest>> => {
    return ax.post("auth/sign-in", {
        email: login,
        password: password,
    })
}





export const userApi = {
    login
}