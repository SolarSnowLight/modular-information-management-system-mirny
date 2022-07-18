
import {AxiosResponse} from "axios";



// 400
export type BadRequest = {
    message?: string
}
// 404
export type NotFound = BadRequest
// 500
export type InternalServerError = BadRequest
// default
export type Default = BadRequest


export type ResponseData<D> = Promise<AxiosResponse<D|BadRequest|undefined>>