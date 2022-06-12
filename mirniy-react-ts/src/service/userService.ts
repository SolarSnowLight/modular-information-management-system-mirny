import {BadRequest, AuthResponse, LogoutResponse, userApi, UserRegister} from "../api/userApi";
import {AxiosError} from "axios";
import {ServiceData} from "./utils";


type AuthService = {
    accessToken: string
    refreshToken: string
}
const login = async (login: string, password: string): Promise<ServiceData<AuthService>> => {
    return userApi.login(login,password).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as AuthResponse
                return { data: {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token
                }}
            }
            data = data as BadRequest
            if (status===401) {
                return { error: { code: 'incorrect data', message: data.message } }
            }
            return { error: { code: 'error', message: data.message } }
        },
        (error: AxiosError) => {
            // error.code: "ERR_NETWORK" when server not found on localhost - крч ошибка соединения с сервером
            return { error: { code: 'connection error' } }
        }
    )
}




type LogoutService = {
    isLogout: boolean
}
const logout = async (
    accessToken: string|null|undefined, refreshToken: string|null|undefined
): Promise<ServiceData<LogoutService>> => {
    return userApi.logout(accessToken, refreshToken).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as LogoutResponse
                return { data: {
                    isLogout: data.is_logout
                }}
            }
            data = data as BadRequest
            if (status===401) {
                return { error: { code: 401, message: data.message } }
            }
            return { error: { code: 'error', message: data.message } }
        },
        (error: AxiosError) => {
            // error.code: "ERR_NETWORK" when server not found on localhost - крч ошибка соединения с сервером
            return { error: { code: 'connection error' } }
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
                        refreshToken: data.refresh_token
                    }}
            }
            data = data as BadRequest
            return { error: { code: 'error', message: data.message } }
        },
        (error: AxiosError) => {
            // error.code: "ERR_NETWORK" when server not found on localhost - крч ошибка соединения с сервером
            return { error: { code: 'connection error' } }
        }
    )
}


export const userService = {
    login,
    logout,
    signup,
}