import {BadRequest, LoginResponse, userApi} from "../api/userApi";
import {AxiosError} from "axios";
import {ServiceData} from "./utils";


type LoginService = {
    accessToken: string
    refreshToken: string
}
const login = async (login: string, password: string): Promise<ServiceData<LoginService>> => {
    return userApi.login(login,password).then(
        response => {
            let { status, data } = response
            if (status===200) {
                data = data as LoginResponse
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



export const userService = {
    login
}