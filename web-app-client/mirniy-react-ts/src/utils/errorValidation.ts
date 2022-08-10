import {ErrorType, errorUtils} from "./errorUtils";
import {empty} from "@rrainpath/ts-utils";


export type Validator<V = any, Vs = object> = (value: V, values: Vs) => ErrorType | undefined

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




const validate = <Vs extends object>(
    errors: { [field: string]: ErrorType[] },
    validators: { [Field in keyof typeof errors]?: Validator<Vs>[] },
    values: Vs,
    config: { mode: 'form-first-error' | 'field-first-error' | 'all-errors' } = { mode: 'field-first-error' },
) => {
    //console.log('errors:',errors)
    //console.log('validators:',validators)
    //console.log('values:',values)
    //console.log('config:',config)

    loop: for (const f in errors){
        const v = values[f]
        const vdArr = validators[f]??[]
        for (let i = 0; i < vdArr.length; i++) {
            const vd = vdArr[i]
            const result = vd(v,values)
            if (result) {
                errors[f].push(result)
                if (config.mode==='form-first-error') return
                if (config.mode==='field-first-error') continue loop
            }
        }
    }
}


const hasError = (errors: { [field: string]: ErrorType[] }) => {
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