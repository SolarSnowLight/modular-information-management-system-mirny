


/*
    по идее
    403 - unauthorized while login
    401 - forbidden if try to access to resource and can't
 */

import {empty} from "@rrainpath/ts-utils";

export type ErrorType = {
    code: 401 | 403 | 404 | 500 | number
        | 'error' | 'errors' | 'unknown error'
        | 'connection error'
        | 'incorrect' | 'required'
        | 'incorrect data'  | 'incorrect login' | 'incorrect password'
    message?: string|undefined
    extra?: any
}


const of = (
    code: ErrorType['code'],
    message?: ErrorType['message'],
    extra?: ErrorType['extra']
): ErrorType => ({ code, message, extra })





const emailPattern = /^.+@.+$/



const isPositiveInteger = (i: number) => {
    return Number.isInteger(i) && i>0
}
const isValidEmail = (email?: string|empty) => email && emailPattern.test(email)












export const errorUtils = {
    of,
    isValidEmail,
    isPositiveInteger,
}