
import {Reducer} from "redux";
import {ErrorType} from "src/utils/errorUtils";


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


type ErrorsDraft = {
    login?: undefined | {
        common?: ErrorType[] | undefined,
        errors?: undefined | {
            login?: ErrorType[] | undefined,
            password?: ErrorType[] | undefined,
        }
    },
    logout?: undefined | {
        common?: ErrorType[] | undefined,
        errors?: undefined | { }
    },
    signup?: undefined | {
        common?: ErrorType[] | undefined,
        errors?: undefined | {
            email?: ErrorType[] | undefined,
            password?: ErrorType[] | undefined,
            name?: ErrorType[] | undefined,
            surname?: ErrorType[] | undefined,
            patronymic?: ErrorType[] | undefined,
            nickname?: ErrorType[] | undefined,
            phone?: ErrorType[] | undefined,
            birthDate?: ErrorType[] | undefined,
        }
    },
    articles?: undefined | {
        common?: ErrorType[] | undefined,
        errors?: undefined | { }
    },
}

export type ErrorsState = typeof initialState
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
            patronymic: [] as ErrorType[],
            nickname: [] as ErrorType[],
            phone: [] as ErrorType[],
            birthDate: [] as ErrorType[],
        }
    },
    articles: {
        hasError: false,
        common: [] as ErrorType[],
        errors: { }
    }
}



export const errorsReducer: Reducer<ErrorsState> = (state = initialState, action) => {
    switch (action.type){

        // if property exists and set to undefined - it will be reseted
        case 'addErrors': {
            const newState = {...state}
            const parts = action.payload as ErrorsDraft
            for (let k1 in parts) if (k1 in newState) {
                if (typeof parts[k1] === 'object'){
                    newState[k1] = {...newState[k1]}
                    let hasError = false

                    if ('common' in parts[k1]!){
                        let common = parts[k1]!.common
                        if (common instanceof Array && common.length>0){
                            newState[k1]!.common = [...newState[k1]!.common, ...common]
                        } else if (common === undefined){
                            newState[k1]!.common = initialState[k1]!.common!
                        }
                        if (newState[k1]!.common.length > 0) hasError = true
                    }

                    if ('errors' in parts[k1]!) {
                        let errors = parts[k1]!.errors
                        if (typeof errors === 'object'){
                            for (let k2 in parts[k1]!.errors) if (k2 in newState[k1].errors) {
                                let prop = parts[k1]!.errors[k2]
                                if (prop instanceof Array && prop.length > 0) {
                                    newState[k1].errors = {...newState[k1].errors}
                                    newState[k1]!.hasError = true
                                    newState[k1]!.errors[k2] = [...newState[k1]!.errors[k2], ...prop]
                                } else if (prop === undefined) {
                                    newState[k1]!.errors[k2] = initialState[k1]!.errors[k2]!
                                    // todo check has errors
                                }
                                if (newState[k1]!.errors[k2]!.length > 0) hasError = true
                            }
                        } else if (errors === undefined) {
                            newState[k1]!.errors = initialState[k1]!.errors!
                        }
                    }

                    newState[k1]!.hasError = hasError

                } else if (parts[k1] === undefined){
                    newState[k1] = initialState[k1]
                }
            }
            return newState
        }

        default: return state
    }
}



const addErrors = (errors: ErrorsDraft) => ({
    type: 'addErrors', payload: errors
})



export const errorsActions = {
    addErrors,
}

