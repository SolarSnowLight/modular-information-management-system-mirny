import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppThunk} from "./store";
import {userService} from "../service/userService";
import {errorsActions} from "./errorsSlice";


type User = {
    name: string
}|null

// Define a type for the slice state
export interface UserState {
    accessJwt: string|null|undefined
    refreshJwt: string|null|undefined
    user: User|undefined
}


// Define the initial state using that type
const initialState: UserState = {
    accessJwt: undefined,
    refreshJwt: undefined,
    user: undefined,
}


const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setJwt: (state, action: PayloadAction<{ accessJwt: string|null, refreshJwt: string|null }>) => {
            state.accessJwt = action.payload.accessJwt
            state.refreshJwt = action.payload.refreshJwt
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        }
    }
})



const login = (login: string, password: string): AppThunk =>
    async dispatch => {


        // todo there need to prevalidate fields
        if (password.length<6){
            dispatch(errorsActions.setErrors({
                name: 'login',
                errors: {
                    hasError: true,
                    common: { errors: undefined },
                    errors: {
                        login: { errors: undefined },
                        password: { errors: [
                                { code: 'incorrect password', message: 'Пароль должен быть не короче 6 символов' }
                        ] },
                    }
                }
            }))
            return
        }

        let { data, error } = await userService.login(login, password)

        if (error){
            switch (error.code){
                case "connection error":
                    dispatch(errorsActions.setErrors({
                        name: 'login',
                        errors: {
                            hasError: true,
                            common: { errors: [
                                { code: 'connection error', message: 'Ошибка соединения с сервером' }
                            ] },
                            errors: {
                                login: { errors: undefined },
                                password: { errors: undefined },
                            }
                        }
                    }))
                    break
                case "incorrect data":
                    dispatch(errorsActions.setErrors({
                        name: 'login',
                        errors: {
                            hasError: true,
                            common: { errors: [
                                    { code: 'incorrect data', message: 'Неправильный логин или пароль' }
                                ] },
                            errors: {
                                login: { errors: undefined },
                                password: { errors: undefined },
                            }
                        }
                    }))
                    break
                default:
                    dispatch(errorsActions.setErrors({
                        name: 'login',
                        errors: {
                            hasError: true,
                            common: { errors: [
                                    { code: 'error', message: 'Ошибка' }
                                ] },
                            errors: {
                                login: { errors: undefined },
                                password: { errors: undefined },
                            }
                        }
                    }))
                    break
            }
            return
        }

        data = data!
        dispatch(errorsActions.clearErrors('login'))


        dispatch(setJwt({
            accessJwt: data.accessToken,
            refreshJwt: data.refreshToken
        }))


        // todo request user or get info from jwt

        const user = {
            name: 'someusername'
        }
        dispatch(setUser(user))
    }


const logout = (): AppThunk =>
    async dispatch => {
        dispatch(setJwt({ accessJwt: null, refreshJwt: null }))
        dispatch(setUser(null))
    }


// Action creators are generated for each case reducer function
const { setJwt, setUser } = userSlice.actions

export const userActions = {
    setJwt,
    setUser,
    login,
    logout
}
export const userReducer = userSlice.reducer