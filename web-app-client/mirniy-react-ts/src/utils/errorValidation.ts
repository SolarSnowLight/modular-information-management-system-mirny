import {ErrorType, errorUtils} from "./errorUtils";
import {empty} from "@rrainpath/ts-utils";


type Errors = { [field: string]: ErrorType[] }
type Values = object
type Validator<V = any, Vs = Values> = (value: V, values: Vs) => ErrorType | undefined
type Validators<Es extends Errors, Vs extends Values> = { [Field in (keyof Es & keyof Vs)]?: Validator<Vs[Field],Vs>[] };


const required = (value: string, message: string) =>
    value.length<=0 ? errorUtils.of('required', message) : undefined

const checkPositiveInteger = (value: string, message: string) => {
    const v = +value
    return !(Number.isSafeInteger(+v) && v>0) ? errorUtils.of('incorrect', message) : undefined
}

const checkEmail = (email?: string|empty): ErrorType|undefined => {
    if (!errorUtils.isValidEmail(email))
        return errorUtils.of('incorrect', 'Некорректный формат email')
}


/*const validate0 = <Es extends Errors, Vs extends Values>(
    errors: Es,
    validators: Validators<Es,Vs>,
    values: Vs,
    config: { mode: 'form-first-error' | 'field-first-error' | 'all-errors' } = { mode: 'field-first-error' },
) => {
    loop: for (const f in errors){
        const v = values[f]
        const vds = validators[f]??[]
        for (let i = 0; i < vds.length; i++) {
            const vd = vds[i]
            const result = vd(v,values)
            if (result) {
                errors[f].push(result)
                if (config.mode==='form-first-error') return
                if (config.mode==='field-first-error') continue loop
            }
        }
    }
}*/
const validate = <Es extends Errors, Vs extends Values>(
    errors: Es,
    validators: Validators<Es,Vs>,
    values: Vs,
    config: { mode: 'form-first-error' | 'field-first-error' | 'all-errors' } = { mode: 'field-first-error' },
) => {
    loop: for (const field in validators){
        const vds = validators[field]
        const v = values[field]
        for (let i = 0; i < vds.length; i++) {
            const vd = vds[i]
            const result = vd(v,values)
            if (result) {
                errors[field].push(result)
                if (config.mode==='form-first-error') return
                if (config.mode==='field-first-error') continue loop
            }
        }
    }
}


const hasError = (errors: Errors) => {
    for (const e in errors) {
        if (errors[e].length > 0) return true
    }
    return false
}


export const errorValidation = {
    required,
    checkPositiveInteger,
    checkEmail,
    validate,
    hasError,
}
export type {
    Errors,
    Values,
    Validator,
    Validators,
}