import {ErrorType} from "../redux/errors";


export type ServiceData<D> = {
    data?: D,
    error?: ErrorType
}