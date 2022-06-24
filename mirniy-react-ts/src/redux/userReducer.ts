import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppThunk} from "./store";
import {userService} from "../service/userService";
import {loadingActions2} from "./loadingReducer2";
import {UserRegister} from "../api/userApi";
import {errorsActions2} from "./errorsReducer2";


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



const login = (login: string, password: string): AppThunk =>
    async (dispatch, getState) => {

        let state = getState()
        if(state.loading2.login) return

        dispatch(errorsActions2.addErrors({ login: undefined }))

        let anyPrevalidationError = false
        // prevalidation
        if (login.length<=0){
            anyPrevalidationError = true
            dispatch(errorsActions2.addErrors({
                login: { errors: { login: [
                    { code: 'required', message: 'Email обязателен' }
                ]}}
            }))
        }
        if (!emailPattern.test(login)) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addErrors({
                login: { errors: { login: [
                    { code: 'incorrect', message: 'Неправильный email' }
                ]}}
            }))
        }
        if (password.length<=0){
            anyPrevalidationError = true
            dispatch(errorsActions2.addErrors({
                login: { errors: { password: [
                    { code: 'required', message: 'Пароль обязателен' }
                ]}}
            }))
        }
        if (password.length<6){
            anyPrevalidationError = true
            dispatch(errorsActions2.addErrors({
                login: { errors: { password: [
                    { code: 'incorrect password', message: 'Пароль должен быть не короче 6 символов' }
                ]}}
            }))
        }

        if (anyPrevalidationError) return


        dispatch(loadingActions2.setLoading('login'))
        // request
        let { data, error } = await userService.login(login, password)
            .finally(()=>dispatch(loadingActions2.setLoading('login',false)))
            .catch(err=>{
                dispatch(errorsActions2.addErrors({
                    login: { common: [
                            { code: 'error', message: 'Ошибка' }
                        ]}
                }))
                throw err
            })


        // error check
        if (error) switch (error.code){
            case "connection error":
                dispatch(errorsActions2.addErrors({
                    login: { common: [
                        { code: 'connection error', message: 'Ошибка соединения с сервером' }
                    ]}
                }))
                return
            case "incorrect data":
                dispatch(errorsActions2.addErrors({
                    login: { common: [
                        { code: 'incorrect data', message: 'Неправильный логин или пароль' }
                    ]}
                }))
                return
            default:
                dispatch(errorsActions2.addErrors({
                    login: { common: [
                        { code: 'error', message: 'Ошибка' }
                    ]}
                }))
                return
        }

        // all is ok
        data = data!

        dispatch(setJwt({
            accessJwt: data.accessToken
        }))


        // todo request user or get info from jwt
        /*const user = {
            name: 'someusername'
        }
        dispatch(setUser(user))*/
    }


const logout = (): AppThunk =>
    async (dispatch, getState) => {


        const state = getState()
        if(state.loading2.logout) return

        dispatch(errorsActions2.clearErrors('logout'))

        let { accessJwt } = state.user


        if (!accessJwt) {
            dispatch(errorsActions2.addError({
                logout: { common:[
                    { code: 401, message: 'Вы не вошли в систему' }
                ] }
            }))
            return
        }

        dispatch(loadingActions2.setLoading('logout'))

        let { data, error } = await userService.logout(accessJwt)
            .finally(()=>dispatch(loadingActions2.setLoading('logout',false)))

        // error check
        if (error){
            switch (error.code){
                case "connection error":
                    dispatch(errorsActions2.addError({
                        logout: { common:[
                            { code: 'connection error', message: 'Ошибка соединения с сервером' }
                        ] }
                    }))
                    return
                case 401:
                    dispatch(errorsActions2.addError({
                        logout: { common:[
                            { code: 401, message: 'Вы не вошли в систему' }
                        ] }
                    }))
                    return
                default:
                    dispatch(errorsActions2.addError({
                        logout: { common:[
                            { code: 'error', message: 'Ошибка' }
                        ] }
                    }))
                    return
            }
        }

        data = data!

        if (!data.isLogout){
            dispatch(errorsActions2.addError({
                logout: { common:[
                    { code: 'error', message: 'Ошибка разлогинивания' }
                ] }
            }))
            return
        }

        dispatch(setJwt({ accessJwt: null }))
        dispatch(setUser(null))
    }



const emailPattern = /^.+@.+$/
const phonePattern = /^\+(\d\D*){9,15}$/
const birthDatePattern = /^\D*(?<day>\d{1,2})\D+(?<month>\d{1,2})\D+(?<year>\d{4})\D*$/

const signup = (userData: UserRegister): AppThunk =>
    async (dispatch, getState) => {

        let state = getState()
        if(state.loading2.signup) return

        dispatch(errorsActions2.clearErrors('signup'))

        let anyPrevalidationError = false
        // prevalidation
        if (userData.email.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { email: [
                    { code: 'required', message: 'email обязателен' }
                ]}}
            }))
        }
        if (!emailPattern.test(userData.email)) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { email: [
                    { code: 'incorrect', message: 'Неправильный email' }
                ]}}
            }))
        }
        if (userData.password.length<=0){
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { password: [
                    { code: 'required', message: 'Пароль обязателен' }
                ]}}
            }))
        }
        if (userData.password.length < 6) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { password: [
                    { code: 'incorrect', message: 'Пароль должен быть не короче 6 символов' }
                ]}}
            }))
        }
        if (userData.name.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { name: [
                    { code: 'required', message: 'Имя обязательно' }
                ]}}
            }))
        }
        if (userData.surname.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { surname: [
                    { code: 'required', message: 'Фамилия обязательна' }
                ]}}
            }))
        }
        if (userData.patronymic.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { patronymic: [
                    { code: 'required', message: 'Отчество обязательно' }
                ]}}
            }))
        }
        if (userData.nickname.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { nickname: [
                    { code: 'required', message: 'Никнейм обязателен' }
                ]}}
            }))
        }
        if (userData.phone.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { phone: [
                    { code: 'required', message: 'Телефон обязателен' }
                ]}}
            }))
        }
        let phoneMatch = phonePattern.exec(userData.phone)
        if (!phoneMatch) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { phone: [
                    { code: 'incorrect', message: "Телефон должен начинаться с '+' и иметь 9-15 цифр, разделённых как угодно" }
                ]}}
            }))
        }

        if (userData.birthDate.length <= 0) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
                signup: { errors: { birthDate: [
                    { code: 'required', message: 'Дата рождения обязательна' }
                ]}}
            }))
        }
        let birthDateMatch = birthDatePattern.exec(userData.birthDate)
        if (!birthDateMatch) {
            anyPrevalidationError = true
            dispatch(errorsActions2.addError({
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
            dispatch(errorsActions2.addError({
                signup: { errors: { birthDate: [
                            { code: 'incorrect', message: "Дата рождения некорректна" }
                        ]}}
            }))
        }


        if (anyPrevalidationError) return

        userData.phone = '+'+userData.phone.replaceAll(/\D/g,"")
        userData.birthDate = `${(day+'').padStart(2,'0')}-${(month+'').padStart(2,'0')}-${(year+'').padStart(4,'0')}`

        console.log('userData', userData)


        dispatch(loadingActions2.setLoading('signup'))

        // request
        let {data, error} = await userService.signup(userData)
            .finally(()=>dispatch(loadingActions2.setLoading('signup',false)))

        // error check
        if (error) switch (error.code) {
            case "connection error":
                dispatch(errorsActions2.addError({
                    signup: { common: [
                        { code: 'connection error', message: 'Ошибка соединения с сервером' }
                    ]}
                }))
                return
            case 500:
                dispatch(errorsActions2.addError({
                    signup: { common: [
                            { code: 'error', message: error.message }
                        ]}
                }))
                return
            default:
                dispatch(errorsActions2.addError({
                    signup: { common: [
                            { code: 'error', message: 'Ошибка' }
                        ]}
                }))
                return
        }


        // all is ok
        data = data!
        dispatch(errorsActions2.clearErrors('signup'))


        dispatch(setJwt({
            accessJwt: data.accessToken
        }))


        // todo request user or get info from jwt
        /*const user = {
            name: 'someusername'
        }
        dispatch(setUser(user))*/
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