import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {AppThunk} from "./store";
import {ErrorType} from "../service/utils";
import {Optional} from "@rrainpath/ts-utils";


type Errors<T extends string> = {
    hasError: boolean
    common: { errors?: ErrorType[] }
    errors: {
        [Prop in T]: { errors?: ErrorType[] }
    }
}

// Define a type for the slice state
export interface ErrorsState {

    /*login: {
        hasError: boolean
        common: { errors?: ErrorType[] }
        errors: {
            login: { errors?: ErrorType[] }
            password: { errors?: ErrorType[] }
        }
    }*/
    login: Errors<'login'|'password'>

}

// Define the initial state using that type
const initialState: ErrorsState = {
    login: {
        hasError: false,
        common: { errors: undefined },
        errors: {
            login: { errors: undefined },
            password: { errors: undefined },
        }
    }
}

type ErrorFields = keyof ErrorsState

// todo more concrete errors
type SetErrors<T extends keyof ErrorsState> = {
    name: T
    errors: ErrorsState[T]
}


const errorsSlice = createSlice({
    name: 'errors',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setErrors: (state, action: PayloadAction<SetErrors<keyof ErrorsState>>) => {
            state[action.payload.name] = action.payload.errors
        },
        clearErrors: (state, action: PayloadAction<keyof ErrorsState>) => {
            state[action.payload] = initialState[action.payload]
        }
    }
})



// Action creators are generated for each case reducer function
const { setErrors, clearErrors } = errorsSlice.actions

export const errorsActions = {
    setErrors,
    clearErrors,
}
export const errorsReducer = errorsSlice.reducer