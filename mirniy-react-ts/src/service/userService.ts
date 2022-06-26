import {BadRequest, AuthResponse, LogoutResponse, userApi, UserRegister} from "../api/userApi";
import Axios, {AxiosError} from "axios";
import {ServiceData} from "./utils";
import {getAccessJwt} from "../api/ax";


type AuthService = {
    accessToken: string
}
const login = async (login: string, password: string): Promise<ServiceData<AuthService>> => {
    return userApi.login(login,password).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as AuthResponse
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
    return userApi.logout(getAccessJwt()).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as LogoutResponse
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




const signup = async (userData: UserRegister): Promise<ServiceData<AuthService>> => {
    return userApi.signup(userData).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as AuthResponse
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


export const userService = {
    login,
    logout,
    signup,
}