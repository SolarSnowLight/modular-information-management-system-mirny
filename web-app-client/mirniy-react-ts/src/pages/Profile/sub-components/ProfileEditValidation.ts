import {ErrorType, errorUtils} from "src/utils/errorUtils";
import {errorValidation, Validators} from "src/utils/errorValidation";


const req = errorValidation.required

const checkYear = (year: string) => {
    return req(year,'Год рождения обязателен')
    || (!errorUtils.isPositiveInteger(+year) ? errorUtils.of('incorrect','Год должен быть целым положительным числом') : undefined)
    || ((year+'').length!==4 ? errorUtils.of('incorrect', 'Год должен быть четырёхзначным') : undefined)
}
const checkMonth = (month: string) => {
    return req(month,'Месяц рождения обязателен')
    || (errorValidation.checkPositiveInteger(month,'Месяц должен быть целым положительным числом'))
    || (+month>=1 && +month<=12 ? undefined : errorUtils.of('incorrect', 'Номер месяца должен быть от 1 до 12'))
}

type Errors = {
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
type Values = {
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

const initialErrors = (): Errors => ({
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
const checkOnErrors = async (values: Values): Promise<Errors> => {
    const errors = initialErrors()
    const validators: Validators<Errors, Values> = {
        name: [ v => req(v,'Имя обязательно') ],
        surname: [ v => req(v,'Фамилия обязательна') ],
        patronymic: [ v => req(v,'Отчество обязательно') ],
        day: [
            v => req(v,'День рождения обязателен'),
            (v,vs) => {
                let err = checkYear(vs.year)
                if (err) return undefined
                err = checkMonth(vs.month)
                if (err) return undefined

                err = errorValidation.checkPositiveInteger(v,'День должен быть целым положительным числом')
                if (err) return err

                const d = +vs.day, m = +vs.month, y = +vs.year

                const maxD = new Date(y,(m-1)+1,0).getDate()

                if (d<1 || d>maxD) return errorUtils.of('incorrect', 'Неправильный день')
                return undefined
            }
        ],
        month: [ checkMonth ],
        year: [ checkYear ],
        nick: [ v => req(v,'Никнейм обязателен') ],
        pwd: [
            v => req(v,'Пароль обязателен'),
            v => v.length<6 ? errorUtils.of('incorrect', 'Пароль должен быть не короче 6 символов') : undefined,
        ],
        pwd2: [
            v => req(v,'Повторите пароль'),
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
