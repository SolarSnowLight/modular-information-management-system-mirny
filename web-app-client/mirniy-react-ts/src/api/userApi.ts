import ax, {CustomConfig, getAccessJwt} from './ax'
import {ApiResult} from "./utils";
import {AxiosRequestConfig} from "axios";





export type AuthApi = {
    access_token: string
}

const login = async (
    login: string, password: string
): ApiResult<AuthApi> => {
    return ax.post("auth/sign-in", {
        email: login,
        password: password,
    })
}




const refreshJwts = async (authorizationHeader: string|number|boolean) => {
    const configWithCustomData: AxiosRequestConfig & CustomConfig = {
        headers: { Authorization: authorizationHeader },
        customData: { isRefreshJwtsRequest: true },
    }
    return ax.post<AuthApi>('auth/refresh', undefined, configWithCustomData )
}




export type LogoutApi = {
    is_logout: boolean
}

const logout = async (): ApiResult<LogoutApi> => {
    return ax.post('auth/logout', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export type UserRegisterApiInput = {
    email: string
    password: string
    data: {
        name: string
        surname: string
        patronymic: string
        date_birth: string
        phone: string
        gender: boolean
        nickname: string
    }
}

const signup = async (userData: UserRegisterApiInput): ApiResult<AuthApi> => {
    return ax.post('auth/sign-up',userData)
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

const getProfile = async (): ApiResult<UserProfileApi> => {
    return ax.post('user/profile/get', undefined, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




const updateProfile = async (profileData: UserProfileApi): ApiResult<UserProfileApi> => {
    return ax.post('user/profile/update', profileData, {
        headers: { Authorization: `Bearer ${getAccessJwt()}`}
    })
}




export const userApi = {
    login,
    refreshJwts,
    logout,
    signup,
    getProfile,
    updateProfile,
}