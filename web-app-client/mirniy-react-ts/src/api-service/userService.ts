import {AuthResponseApi, LogoutResponseApi, userApi, UserProfileApi, UserRegisterApi} from "src/api/userApi";
import Axios, {AxiosError} from "axios";
import {ServData, ServiceData, serviceUtils, ServResult} from "./utils";
import {BadRequest} from "src/api/utils";
import {articleApi, ArticlesApiResponse} from "../api/articleApi";
import {awaitPromisesArray} from "../utils/utils";
import {errors} from "../models/errors";
import {ArticlesResponse} from "./articleService";


type AuthService = {
    accessToken: string
}
const login = async (login: string, password: string): Promise<ServiceData<AuthService>> => {
    return userApi.login(login,password).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as AuthResponseApi
                return { data: {
                    accessToken: data.access_token,
                }}
            }
            data = data as BadRequest|undefined
            return { error: { code: 'error', message: data?.message } }
        },
        (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error)){
                if (error.code==='ERR_NETWORK')
                    // error.code: "ERR_NETWORK" when server not found
                    return { error: { code: 'connection error' } }
                if (error.response){
                    const status = error.response.status
                    const data = error.response.data as BadRequest|undefined

                    if (status===400)
                        return { error: { code: 'error', message: data?.message } }
                    if (status===401)
                        return { error: { code: 'incorrect data', message: data?.message } }
                    if (status===500)
                        return { error: { code: 500, message: data?.message } }

                    return { error: { code: 'error', message: data?.message } }
                }
            }
            return { error: { code: 'error' } }
        }
    )
}




type LogoutService = {
    isLogout: boolean
}
const logout = async (): Promise<ServiceData<LogoutService>> => {
    return userApi.logout().then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as LogoutResponseApi
                return { data: {
                    isLogout: data.is_logout
                }}
            }
            data = data as BadRequest
            return { error: { code: 'error', message: data.message } }
        },
        (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error)){
                if (error.code==='ERR_NETWORK')
                    // error.code: "ERR_NETWORK" when server not found
                    return { error: { code: 'connection error' } }
                if (error.response){
                    const status = error.response.status
                    const data = error.response.data as BadRequest|undefined

                    if (status===400)
                        return { error: { code: 'error', message: data?.message } }
                    if (status===401)
                        return { error: { code: 401, message: data?.message } }
                    if (status===500)
                        return { error: { code: 500, message: data?.message } }

                    return { error: { code: 'error', message: data?.message } }
                }
            }
            return { error: { code: 'error' } }
        }
    )
}




const signup = async (userData: UserRegisterApi): Promise<ServiceData<AuthService>> => {
    return userApi.signup(userData).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as AuthResponseApi
                return { data: {
                        accessToken: data.access_token,
                    }}
            }
            data = data as BadRequest
            return { error: { code: 'error', message: data.message } }
        },
        (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error)){
                if (error.code==='ERR_NETWORK')
                    // error.code: "ERR_NETWORK" when server not found
                    return { error: { code: 'connection error' } }
                if (error.response){
                    const status = error.response.status
                    const data = error.response.data as BadRequest|undefined

                    if (status===400)
                        return { error: { code: 'error', message: data?.message } }
                    if (status===401)
                        return { error: { code: 401, message: data?.message } }
                    if (status===500)
                        return { error: { code: 500, message: data?.message } }

                    return { error: { code: 'error', message: data?.message } }
                }
            }
            return { error: { code: 'error' } }
        }
    )
}



export type ProfileServ = {
    name: string
    surname: string
    patronymic: string
    sex: boolean
    phone: string
    nickname: string
    birthDate: string
}

const getProfile = async (): Promise<ServResult<ProfileServ>> => {
    return userApi.getProfile().then(
        async response => {
            let { status, data } = response
            if (status===200) {
                data = data as UserProfileApi
                const finalData: ServData<ProfileServ> = { data: {
                    name: data.name,
                    surname: data.surname,
                    patronymic: data.patronymic,
                    sex: data.gender,
                    phone: data.phone,
                    nickname: data.nickname,
                    birthDate: data.date_birth,
                } }
                return finalData
            }

            return serviceUtils.defaultError()
        },
        serviceUtils.generalError
    )
}

const updateProfile = async (profileData: ProfileServ): Promise<ServResult<ProfileServ>> => {
    return userApi.updateProfile({
        name: profileData.name,
        surname: profileData.surname,
        patronymic: profileData.patronymic,
        gender: profileData.sex,
        phone: profileData.phone,
        nickname: profileData.nickname,
        date_birth: profileData.birthDate,
    }).then(
        async response => {
            let { status, data } = response
            if (status===200) {
                data = data as UserProfileApi
                const finalData: ServData<ProfileServ> = { data: {
                    name: data.name,
                    surname: data.surname,
                    patronymic: data.patronymic,
                    sex: data.gender,
                    phone: data.phone,
                    nickname: data.nickname,
                    birthDate: data.date_birth,
                } }
                return finalData
            }

            return serviceUtils.defaultError()
        },
        serviceUtils.generalError
    )
}




export const userService = {
    login,
    logout,
    signup,
    getProfile,
    updateProfile,
}