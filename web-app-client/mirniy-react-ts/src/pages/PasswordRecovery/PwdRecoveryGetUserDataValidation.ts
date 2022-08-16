import {ErrorType} from "src/utils/errorUtils";
import {errorValidation} from "src/utils/errorValidation";


type Errors = {
    email: ErrorType[]
    common: ErrorType[]
}
const getInitialErrors = (): Errors => ({
    email: [],
    common: [],
})
type Values = {
    email: string
}
const checkOnErrors = async (values: Values): Promise<Errors> => {
    const errors = getInitialErrors()
    const validators = {
        email: [
            v => errorValidation.required(v,'Email обязателен'),
            v => errorValidation.checkEmail(v),
        ],
    }
    errorValidation.validate(errors,validators,values)
    return errors
}




export const pwdRecoveryGetUserDataValidation = {
    getInitialErrors,
    checkOnErrors,
}
