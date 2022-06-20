import Axios, {AxiosError} from "axios"
import axios, {AxiosResponse} from "axios"

const ip = 'localhost'
const port = '5000'
const basePath = ""
const API_URL = `http://${ip}:${port}/${basePath}`

const ax = Axios.create({
    baseURL: API_URL,
    withCredentials: true
})


// todo delete token if it not valid after interceptor validation

ax.interceptors.response.use(
    (config) => config,
    async (error: Error|AxiosError) => {
        //console.log('ERROR:',error)
        if (Axios.isAxiosError(error) && error.config && error.response){

            // Для повтора исходного запроса
            const originalRequest = error.config;

            // Обновление токена
            if(
                error.response.status === 401
                && (error.config)
                // @ts-ignore
                && (!error.config._isRetry))
            {
                // @ts-ignore
                originalRequest._isRetry = true;

                //console.log('Authorization:', originalRequest.headers.Authorization)
                await ax.post<AuthResponse>(`auth/refresh`, undefined, {
                    headers: {
                        Authorization: originalRequest.headers?.Authorization ?? ''
                    }
                })

                //localStorage.setItem('token', response.data.accessToken);

                await ax.request(originalRequest);
            }
        }

        throw error
    }
)



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