import Axios, {AxiosError} from "axios";
import {AuthResponse} from "./userApi";
import {Store} from "src/redux/store";
import {userActions, UserState} from "src/redux/userReducer";
import {trimSlash} from "src/utils/utils";

const ip = 'localhost'
const port = '5000'
const basePath = ""
export const API_URL = trimSlash(`http://${ip}:${port}/${basePath}`)


const ax = Axios.create({
    baseURL: API_URL,
    withCredentials: true
})


export let getAccessJwt = (): UserState["accessJwt"] => undefined


const refreshPath = 'auth/refresh'
export function setupAxios(reduxStore: Store){

    const removeAuthData = () => {
        //localStorage.removeItem('token')
        reduxStore.dispatch(userActions.setJwt({ accessJwt: null }))
        reduxStore.dispatch(userActions.setUser(null))
    }
    const setAuthData = (authData: { accessJwt: string }) => {
        //localStorage.setItem('token', authData.accessJwt)
        reduxStore.dispatch(userActions.setJwt(authData))
    }

    ax.interceptors.response.use(
        response => response,
        async (error: Error|AxiosError) => {
            //console.log('ERROR:',error)
            if (Axios.isAxiosError(error) && error.config && error.response){

                // Для повтора исходного запроса
                // Access token is included from config if it was there
                // Refresh token is automatically included from cookies
                const originalRequest = error.config as typeof error.config & { _isRetried?: boolean }
                const originalUrl = new URL(Axios.getUri(originalRequest))
                //console.log('path',originalUrl.pathname)

                if (originalUrl.pathname.endsWith(refreshPath)) {
                    //console.log(error.response.status)
                    //console.log(error)
                    if (error.response.status === 401){
                        removeAuthData()
                    } else {
                        console.log('ошибка обновления access token')
                    }
                } else if (error.response.status === 401){
                    if (!originalRequest._isRetried){
                        // Обновление токена
                        originalRequest._isRetried = true;

                        const secondResponse = await ax.post<AuthResponse>(refreshPath, undefined, {
                            //headers: { Authorization: `Bearer ${getAccessJwt()}`}
                            headers: { Authorization: originalRequest.headers?.Authorization ?? 'Bearer undefined'}
                        })

                        const newAccessJwt = secondResponse.data.access_token

                        setAuthData({ accessJwt: newAccessJwt })

                        originalRequest.headers ??= {}
                        originalRequest.headers.Authorization = `Bearer ${newAccessJwt}`
                        await ax.request(originalRequest);
                    } else {
                        removeAuthData()
                    }
                }
            }

            throw error
        }
    )

    getAccessJwt = () => reduxStore.getState().user.accessJwt

}



export default ax
