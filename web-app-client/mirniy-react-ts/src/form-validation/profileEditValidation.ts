import {ErrorType, errorUtils} from "src/utils/errorUtils";
import {errorValidation} from "src/utils/errorValidation";
import {DateTime} from "../utils/DateTime";
import {ifError} from "assert";


type ProfileEditErrors = {
    name: ErrorType[]
    surname: ErrorType[]
    patronymic: ErrorType[]

    day: ErrorType[]
    month: ErrorType[]
    year: ErrorType[]

    nick: ErrorType[]
    pwd: ErrorType[]
    pwd2: ErrorType[]

    common: ErrorType[]
}
const initialErrors = (): ProfileEditErrors => ({
    name: [],
    surname: [],
    patronymic: [],

    day: [],
    month: [],
    year: [],

    nick: [],
    pwd: [],
    pwd2: [],

    common: [],
})
type ProfileEditValues = {
    name: string
    surname: string
    patronymic: string
    day: string
    month: string
    year: string
    nick: string
    pwd: string
    pwd2: string
}
const checkOnErrors = async (values: ProfileEditValues): Promise<ProfileEditErrors> => {
    const errors = initialErrors()
    const validators = {
        name: [ v => errorValidation.required(v,'Имя обязательно') ],
        surname: [ v => errorValidation.required(v,'Фамилия обязательна') ],
        patronymic: [ v => errorValidation.required(v,'Отчество обязательно') ],
        day: [
            v => errorValidation.required(v,'День рождения обязателен'),
            v => errorValidation.checkPositiveInteger(v,'День должен быть целым положительным числом'),
            (v,vs) => {
                const d = +vs.day, m = +vs.month, y = +vs.year
                if (!errorUtils.isPositiveInteger(y) || (y+'').length!==4) return undefined
                if (!errorUtils.isPositiveInteger(m) || m<1||m>12) return undefined
                if (!errorUtils.isPositiveInteger(d)) return undefined

                const maxD = new Date(y,(m-1)+1,0).getDate()

                if (d<1 || d>maxD)
                    return errorUtils.of('incorrect', 'Неправильный день')
                return undefined
            }
        ],
        month: [
            v => errorValidation.required(v,'Месяц рождения обязателен'),
            v => errorValidation.checkPositiveInteger(v,'Месяц должен быть целым положительным числом'),
            v => v>=1 && v<=12 ? undefined : errorUtils.of('incorrect', 'Номер месяца должен быть от 1 до 12')
        ],
        year: [
            v => errorValidation.required(v,'Год рождения обязателен'),
            v => !errorUtils.isPositiveInteger(+v) ? errorUtils.of('incorrect','Год должен быть целым положительным числом') : undefined,
            v => (v+'').length!==4 ? errorUtils.of('incorrect', 'Год должен быть четырёхзначным') : undefined,
        ],
        nick: [ v => errorValidation.required(v,'Никнейм обязателен') ],
        pwd: [
            v => errorValidation.required(v,'Пароль обязателен'),
            v => v.length<6 ? errorUtils.of('incorrect', 'Пароль должен быть не короче 6 символов') : undefined,
        ],
        pwd2: [
            v => errorValidation.required(v,'Повторите пароль'),
            (v,vs) => v===vs.pwd ? undefined : errorUtils.of('incorrect', 'Пароли должны совпадать')
        ]
    }
    errorValidation.validate(errors,validators,values)
    return errors
}




export const profileEditValidation = {
    initialErrors,
    checkOnErrors,
}
/*
export {
    ProfileEditErrors,
    Values
}*/
