import {ErrorType} from "src/utils/errorUtils";
import {errorValidation, Validators} from "src/utils/errorValidation";


type Errors = {
    email: ErrorType[]
    common: ErrorType[]
}
type Values = {
    email: string
}

const getInitialErrors = (): Errors => ({
    email: [],
    common: [],
})
const checkOnErrors = async (values: Values): Promise<Errors> => {
    const errors = getInitialErrors()
    const validators: Validators<Errors, Values> = {
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
