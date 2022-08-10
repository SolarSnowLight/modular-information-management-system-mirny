import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppThunk} from "./store";
import {UserRegisterServ, userService} from "src/api-service/userService";
import {loadingActions} from "./loadingReducer";
import {errorsActions} from "./errorsReducer";
import {errorUtils, ErrorType} from 'src/utils/errorUtils';
import {errorValidation} from "../utils/errorValidation";


type User = {
    name: string
}|null

// Define a type for the slice state
export interface UserState {
    accessJwt: string|null|undefined
    user: User|undefined
}


// Define the initial state using that type
const initialState: UserState = {
    accessJwt: undefined,
    user: undefined,
}


const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setJwt: (state, action: PayloadAction<{ accessJwt: string|null }>) => {
            state.accessJwt = action.payload.accessJwt
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        }
    }
})








const login = (login: string, password: string): AppThunk<Promise<void|boolean>> =>
    async (dispatch, getState) => {

        let state = getState()
        if(state.loading.login) return

        dispatch(errorsActions.addErrors({ login: undefined }))

        {
            let anyPrevalidationError = false
            let error: ErrorType|undefined
            // prevalidation
            if (login.length<=0){
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    login: { errors: { login: [
                                { code: 'required', message: 'Email обязателен' }
                            ]}}
                }))
            }
            if (error = errorValidation.checkEmail(login)) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    login: { errors: { login: [error] }}
                }))
            }
            if (password.length<=0){
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    login: { errors: { password: [
                                { code: 'required', message: 'Пароль обязателен' }
                            ]}}
                }))
            }
            if (password.length<6){
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    login: { errors: { password: [
                        errorUtils.of('incorrect', 'Пароль должен быть не короче 6 символов')
                    ]}}
                }))
            }

            if (anyPrevalidationError) return
        }


        dispatch(loadingActions.setLoading('login'))
        // request
        const r = await userService.login(login, password)
            .finally(()=>dispatch(loadingActions.setLoading('login',false)))

        // error check
        if (r.type==='error') switch (r.error.code){
            case "connection error":
                dispatch(errorsActions.addErrors({
                    login: { common: [
                        { code: 'connection error', message: 'Ошибка соединения с сервером' }
                    ]}
                }))
                return
            case "incorrect data":
                dispatch(errorsActions.addErrors({
                    login: { common: [
                        { code: 'incorrect data', message: 'Неправильный логин или пароль' }
                    ]}
                }))
                return
            default:
                dispatch(errorsActions.addErrors({
                    login: { common: [
                        { code: 'error', message: 'Ошибка' }
                    ]}
                }))
                return
        }


        dispatch(setJwt({
            accessJwt: r.data.accessToken
        }))

        return true
    }


const logout = (): AppThunk<Promise<void|boolean>> =>
    async (dispatch, getState) => {


        const state = getState()
        if(state.loading.logout) return

        dispatch(errorsActions.addErrors({ logout: undefined }))

        let { accessJwt } = state.user


        if (!accessJwt) {
            dispatch(errorsActions.addErrors({
                logout: { common:[
                    { code: 401, message: 'Вы не вошли в систему' }
                ] }
            }))
            return
        }

        dispatch(loadingActions.setLoading('logout'))

        const r = await userService.logout()
            .finally(()=>dispatch(loadingActions.setLoading('logout',false)))


        if (r.type==='error'){
            switch (r.error.code){
                case "connection error":
                    dispatch(errorsActions.addErrors({
                        logout: { common:[
                            { code: 'connection error', message: 'Ошибка соединения с сервером' }
                        ] }
                    }))
                    return
                case 401:
                    dispatch(errorsActions.addErrors({
                        logout: { common:[
                            { code: 401, message: 'Вы не вошли в систему' }
                        ] }
                    }))
                    return
                default:
                    dispatch(errorsActions.addErrors({
                        logout: { common:[
                            { code: 'error', message: 'Ошибка' }
                        ] }
                    }))
                    return
            }
        }


        if (!r.data.isLogout){
            dispatch(errorsActions.addErrors({
                logout: { common:[
                    { code: 'error', message: 'Ошибка разлогинивания' }
                ] }
            }))
            return
        }

        dispatch(setJwt({ accessJwt: null }))
        dispatch(setUser(null))

        return true
    }



const phonePattern = /^\+(\d\D*){9,15}$/
const birthDatePattern = /^\D*(?<day>\d{1,2})\D+(?<month>\d{1,2})\D+(?<year>\d{4})\D*$/

const signup = (userData: UserRegisterServ): AppThunk<Promise<void|boolean>> =>
    async (dispatch, getState) => {

        let state = getState()
        if(state.loading.signup) return

        dispatch(errorsActions.addErrors({ signup: undefined }))
        {
            let anyPrevalidationError = false
            let error: ErrorType|undefined = undefined
            // prevalidation
            if (userData.email.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { email: [
                                { code: 'required', message: 'email обязателен' }
                            ]}}
                }))
            }
            if (error = errorValidation.checkEmail(userData.email)) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { email: [error] }}
                }))
            }
            if (userData.password.length<=0){
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { password: [
                                { code: 'required', message: 'Пароль обязателен' }
                            ]}}
                }))
            }
            if (userData.password.length < 6) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { password: [
                                { code: 'incorrect', message: 'Пароль должен быть не короче 6 символов' }
                            ]}}
                }))
            }
            if (userData.name.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { name: [
                                { code: 'required', message: 'Имя обязательно' }
                            ]}}
                }))
            }
            if (userData.surname.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { surname: [
                                { code: 'required', message: 'Фамилия обязательна' }
                            ]}}
                }))
            }
            if (userData.patronymic.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { patronymic: [
                                { code: 'required', message: 'Отчество обязательно' }
                            ]}}
                }))
            }
            if (userData.nickname.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { nickname: [
                                { code: 'required', message: 'Никнейм обязателен' }
                            ]}}
                }))
            }
            if (userData.phone.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { phone: [
                                { code: 'required', message: 'Телефон обязателен' }
                            ]}}
                }))
            }
            let phoneMatch = phonePattern.exec(userData.phone)
            if (!phoneMatch) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { phone: [
                                { code: 'incorrect', message: "Телефон должен начинаться с '+' и иметь 9-15 цифр, разделённых как угодно" }
                            ]}}
                }))
            }

            if (userData.birthDate.length <= 0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { birthDate: [
                                { code: 'required', message: 'Дата рождения обязательна' }
                            ]}}
                }))
            }
            let birthDateMatch = birthDatePattern.exec(userData.birthDate)
            if (!birthDateMatch) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { birthDate: [
                                { code: 'incorrect', message: "Дата рождения должна быть в формате 31-12-2000 или 1-2-2000" }
                            ]}}
                }))
            }
            const year0 = +birthDateMatch!.groups!.year
            const month0 = +birthDateMatch!.groups!.month
            const day0 = +birthDateMatch!.groups!.day
            const birthDate = new Date(year0, month0-1, day0)
            const year = birthDate.getFullYear()
            const month = birthDate.getMonth()+1
            const day = birthDate.getDate()
            if (year!==year0 || month!==month0 || day!==day0) {
                anyPrevalidationError = true
                dispatch(errorsActions.addErrors({
                    signup: { errors: { birthDate: [
                                { code: 'incorrect', message: "Дата рождения некорректна" }
                            ]}}
                }))
            }


            if (anyPrevalidationError) return

            userData.phone = '+'+userData.phone.replaceAll(/\D/g,"")
            userData.birthDate = `${(day+'').padStart(2,'0')}-${(month+'').padStart(2,'0')}-${(year+'').padStart(4,'0')}`
        }


        dispatch(loadingActions.setLoading('signup'))

        // request
        const r = await userService.signup(userData)
            .finally(()=>dispatch(loadingActions.setLoading('signup',false)))

        // error check
        if (r.type==='error') switch (r.error.code) {
            case "connection error":
                dispatch(errorsActions.addErrors({
                    signup: { common: [
                        { code: 'connection error', message: 'Ошибка соединения с сервером' }
                    ]}
                }))
                return
            case 500:
                dispatch(errorsActions.addErrors({
                    signup: { common: [
                            { code: 'error', message: r.error.message }
                        ]}
                }))
                return
            default:
                dispatch(errorsActions.addErrors({
                    signup: { common: [
                            { code: 'error', message: 'Ошибка' }
                        ]}
                }))
                return
        }


        dispatch(setJwt({
            accessJwt: r.data.accessToken
        }))

        return true
    }




// Action creators are generated for each case reducer function
const { setJwt, setUser } = userSlice.actions

export const userActions = {
    setJwt,
    setUser,
    login,
    logout,
    signup,
}
export const userReducer = userSlice.reducer