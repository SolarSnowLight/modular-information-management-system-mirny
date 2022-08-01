import Axios, {AxiosError} from "axios";
import {AuthApi, userApi} from "./userApi";
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




type CustomConfigData = {
    isRetry?: boolean
    isRefreshJwtsRequest?: boolean
}
export type CustomConfig = {
    customData?: CustomConfigData
}
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

    // Если при запросе возвращается статус 401,
    // значит токен устарел и делается отдельный запрос за новыми токенами,
    // потом повторяется старый запрос но с новым токеном.
    ax.interceptors.response.use(
        response => {
            const originalRequest = response.config as typeof response.config & CustomConfig
            if (response.status===200 && originalRequest.customData?.isRefreshJwtsRequest){
                const d = response.data as AuthApi
                setAuthData({ accessJwt: d.access_token })
            }
            return response
        },
        async (error: Error|AxiosError) => {
            if (Axios.isAxiosError(error) && error.config && error.response){

                const originalRequest = error.config as typeof error.config & CustomConfig

                if (originalRequest.customData?.isRefreshJwtsRequest){
                    if (error.response.status === 401){
                        removeAuthData()
                    } else {
                        console.log('ошибка обновления access token')
                        removeAuthData()
                    }
                } else if (error.response.status === 401 && !originalRequest.customData?.isRetry) {
                    await userApi.refreshJwts(originalRequest.headers?.Authorization ?? 'Bearer undefined')

                    originalRequest.customData ??= {}
                    originalRequest.headers ??= {}
                    originalRequest.customData.isRetry = true
                    originalRequest.headers.Authorization = `Bearer ${getAccessJwt()}`
                    return ax.request(originalRequest)
                }

            }

            throw error
        }
    )

    getAccessJwt = () => reduxStore.getState().user.accessJwt

}



export default ax
