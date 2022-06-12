import {ErrorType} from "../service/utils";
import {Reducer} from "redux";


/*type Errors2<T extends string|never> = {
    hasError: boolean
    common: ErrorType[]
    errors: {
        [Prop in T]: ErrorType[]
    }
}

type Errors2Draft<T extends string|never> = {
    common?: ErrorType[]
    errors?: {
        [Prop in T]?: ErrorType[]
    }
}

type ErrorsState2Draft = {

}*/


//const aa: keyof ErrorsState2['login']['errors']


// Define a type for the slice state
/*export interface ErrorsState2 {
    login: Errors2<'login'|'password'>
    logout: Errors2<never>
}*/


type ErrorsDraft2 = {
    login?: {
        common?: ErrorType[],
        errors?: {
            login?: ErrorType[],
            password?: ErrorType[],
        }
    },
    logout?: {
        common?: ErrorType[],
        errors?: { }
    },
    signup?: {
        common?: ErrorType[],
        errors?: {
            email?: ErrorType[],
            password?: ErrorType[],
            name?: ErrorType[],
            surname?: ErrorType[],
        }
    },
}

export type ErrorsState2 = typeof initialState
const initialState = {
    login: {
        hasError: false,
        common: [] as ErrorType[],
        errors: {
            login: [] as ErrorType[],
            password: [] as ErrorType[],
        }
    },
    logout: {
        hasError: false,
        common: [] as ErrorType[],
        errors: { }
    },
    signup: {
        hasError: false,
        common: [] as ErrorType[],
        errors: {
            email: [] as ErrorType[],
            password: [] as ErrorType[],
            name: [] as ErrorType[],
            surname: [] as ErrorType[],
        }
    },
}



export const errorsReducer2: Reducer<ErrorsState2> = (state = initialState, action) => {
    switch (action.type){
        case 'addErrors':
            const newState = {...state}
            const parts = action.payload as ErrorsDraft2
            for (let k1 in parts){
                if (k1 in newState && typeof parts[k1] === 'object'){
                    newState[k1] = {...newState[k1]}
                    let common = parts[k1]!.common
                    if (common && common instanceof Array && common.length>0){
                        newState[k1]!.hasError = true
                        newState[k1]!.common = [...newState[k1]!.common, ...common]
                    }
                    let errors = parts[k1]!.errors
                    if (errors && typeof errors === 'object')
                        for (let k2 in parts[k1]!.errors){
                            if (k2 in newState[k1].errors){
                                newState[k1].errors = {...newState[k1].errors}
                                let prop = parts[k1]!.errors[k2]
                                if (prop && prop instanceof Array && prop.length>0){
                                    newState[k1]!.hasError = true
                                    newState[k1]!.errors[k2] = [...newState[k1]!.errors[k2], ...prop]
                                }
                            }
                        }
                }
            }
            return newState

        case 'clearErrors':
            const partName = action.payload as keyof ErrorsState2
            return {
                ...state,
                [partName]: {...initialState[partName]}
            }

        default: return state
    }
}



const addError = (errors: ErrorsDraft2) => ({
    type: 'addErrors', payload: errors
})

const clearErrors = (part: keyof ErrorsState2) => ({
    type: 'clearErrors', payload: part
})


export const errorsActions2 = {
    addError,
    clearErrors,
}

