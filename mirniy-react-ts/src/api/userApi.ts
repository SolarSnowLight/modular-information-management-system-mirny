import Axios, {AxiosError} from "axios"
import axios, {AxiosResponse} from "axios"
import ax from './ax'




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


type ResponseData<D> = Promise<AxiosResponse<D|BadRequest|undefined>>


// 200
export type AuthResponse = {
    access_token: string
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
    accessToken: string|null|undefined
): ResponseData<LogoutResponse> => {
    return ax.post('auth/logout', undefined, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}


export type UserRegister = {
    email: string
    password: string
    name: string
    surname: string
    patronymic: string
    nickname: string
    sex: boolean
    phone: string
    birthDate: string
}
const signup = async (userData: UserRegister): ResponseData<AuthResponse> => {
    return ax.post('auth/sign-up',{
        email: userData.email,
        password: userData.password,
        data: {
            name: userData.name,
            surname: userData.surname,
            patronymic: userData.patronymic,
            date_birth: userData.birthDate,
            phone: userData.phone,
            gender: userData.sex,
            nickname: userData.nickname,
        }
    })
}


export const userApi = {
    login,
    logout,
    signup,
}