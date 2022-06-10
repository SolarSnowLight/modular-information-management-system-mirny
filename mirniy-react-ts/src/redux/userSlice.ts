import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppThunk} from "./store";


type User = {
    name: string
}|null

// Define a type for the slice state
export interface UserState {
    jwt: string|null|undefined
    user: User|undefined
}


// Define the initial state using that type
const initialState: UserState = {
    jwt: undefined,
    user: undefined,
}


export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setJwt: (state, action: PayloadAction<string|null>) => {
            state.jwt = action.payload
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        }
    }
})



const login =
    (login: string, password: string): AppThunk =>
    async dispatch => {
        const jwt = 'somejwt'
        const user = {
            name: 'someusername'
        }

        dispatch(setJwt(jwt))
        dispatch(setUser(user))
    }


const logout =
    (): AppThunk =>
    async dispatch => {
        dispatch(setJwt(null))
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
export default userSlice.reducer