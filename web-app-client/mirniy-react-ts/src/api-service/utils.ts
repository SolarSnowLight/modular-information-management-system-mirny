import {ErrorType} from "src/models/errors";


export type ServiceData<D> = {
    data?: D,
    error?: ErrorType
}