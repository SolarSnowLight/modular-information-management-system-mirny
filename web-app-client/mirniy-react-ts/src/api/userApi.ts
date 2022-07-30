import ax, {getAccessJwt} from './ax'
import {ResponseData} from "./utils";





// 200
export type AuthResponseApi = {
    access_token: string
}
const login = async (
    login: string, password: string
): ResponseData<AuthResponseApi> => {
    return ax.post("auth/sign-in", {
        email: login,
        password: password,
    })
}


// 200
export type LogoutResponseApi = {
    is_logout: boolean
}
const logout = async (): ResponseData<LogoutResponseApi> => {
    return ax.post('auth/logout', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}


export type UserRegisterApi = {
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
const signup = async (userData: UserRegisterApi): ResponseData<AuthResponseApi> => {
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




export type UserProfileApi = {
    name: string // "Имя"
    surname: string // "Фамилия"
    patronymic: string // "Отчество"
    gender: boolean // sex: male is true
    phone: string // "+79998887766"
    nickname: string // "nick"
    date_birth: string // "01-01-2000"
}
const getProfile = async (): ResponseData<UserProfileApi> => {
    return ax.post('user/profile/get', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}


const updateProfile = async (profileData: UserProfileApi): ResponseData<UserProfileApi> => {
    return ax.post('user/profile/update', profileData, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}


export const userApi = {
    login,
    logout,
    signup,
    getProfile,
    updateProfile,
}