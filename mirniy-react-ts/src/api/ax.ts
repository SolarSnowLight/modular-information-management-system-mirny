import Axios, {AxiosError} from "axios";
import {AuthResponse} from "./userApi";

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

export default ax
