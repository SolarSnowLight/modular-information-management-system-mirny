

/*
    по идее
    403 - unauthorized while login
    401 - forbidden if try to access to resource and can't
 */

export type ErrorType = {
    code: 401 | 403 | 404
        | 'error' | 'errors'
        | 'connection error' | 'no internet' | 'no server'
        | 'incorrect' | 'required'
        | 'incorrect data'  | 'incorrect login' | 'incorrect password'
    message?: string
    extra?: any
}

export type ServiceData<D> = {
    data?: D,
    error?: ErrorType
}