import {ErrorType} from "../models/errors";


export type ServiceData<D> = {
    data?: D,
    error?: ErrorType
}