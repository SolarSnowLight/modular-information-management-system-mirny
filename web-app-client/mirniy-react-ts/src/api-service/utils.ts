import {errors, ErrorType} from "src/models/errors";
import Axios, {AxiosError} from "axios";
import {BadRequest} from "src/api/utils";


// todo split into 2 types: ServiceError & ServiceData
export type ServiceData<D> = {
    data?: D,
    error?: ErrorType
}

// todo use only await with optional error or catch ???


export type ServData<D> = {
    type: 'data'
    data: D
}
export type ServError = {
    type: 'error'
    error: ErrorType
}
export type ServResult<D> = ServData<D> | ServError
export type Serv<D> = Promise<ServResult<D>>


const buildData = <D>(data: D): ServData<D> => ({ type: 'data', data: data })
const buildError = (
    code: ErrorType['code'],
    message?: ErrorType['message'],
    extra?: ErrorType['extra']
): ServError => ({ type: 'error', error: errors.of(code, message, extra) })


const generalError = (error: Error|AxiosError): ServError => {
    if (Axios.isAxiosError(error)){
        if (error.code==='ERR_NETWORK'){
            // error.code: "ERR_NETWORK" when server not found
            return { error: { code: 'connection error' }, type: 'error' }
        }
        if (error.response){
            const status = error.response.status
            const data = error.response.data as BadRequest|undefined

            /*if (status===400)
                return { error: { code: 'error', message: data?.message } }
            if (status===401)
                return { error: { code: 401, message: data?.message } }
            if (status===500)
                return { error: { code: 500, message: data?.message } }*/

            return { error: { code: status, message: data?.message }, type: 'error' }
        }
    }
    return { error: { code: 'unknown error' }, type: 'error' }
}

const defaultError = (): ServError => ({ error: { code: 'error' }, type: 'error' })


export const serviceUtils = {
    generalError,
    defaultError,
    buildData,
    buildError,
}