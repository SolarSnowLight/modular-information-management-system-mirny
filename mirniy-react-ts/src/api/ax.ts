import Axios, {AxiosError} from "axios";
import {AuthResponse} from "./userApi";
import {store} from "../redux/store";
import {userActions} from "../redux/userReducer";

const ip = 'localhost'
const port = '5000'
const basePath = ""
const API_URL = `http://${ip}:${port}/${basePath}`

const ax = Axios.create({
    baseURL: API_URL,
    withCredentials: true
})




export function setupAxiosInterceptors(reduxStore: typeof store){
    ax.interceptors.response.use(
        response => response,
        async (error: Error|AxiosError) => {
            //console.log('ERROR:',error)
            if (Axios.isAxiosError(error) && error.config && error.response){

                // Для повтора исходного запроса
                // Access token is included from config if it was there
                // Refresh token is automatically included from cookies
                const originalRequest = error.config as typeof error.config & { _isRetried?: boolean }

                // Обновление токена
                if (error.response.status === 401)
                    if (!originalRequest._isRetried){
                        originalRequest._isRetried = true;

                        const secondResponse = await ax.post<AuthResponse>(`auth/refresh`)

                        const accessJwt = secondResponse.data.access_token

                            //localStorage.setItem('token', secondResponse.data.access_token);
                            reduxStore.dispatch(userActions.setJwt({ accessJwt }))

                        ;(originalRequest.headers??{}).Authorization = `Bearer ${accessJwt}`
                        await ax.request(originalRequest);
                    } else {
                        reduxStore.dispatch(userActions.setJwt({ accessJwt: null }))
                        reduxStore.dispatch(userActions.setUser(null))
                    }
            }

            throw error
        }
    )
}



export default ax
