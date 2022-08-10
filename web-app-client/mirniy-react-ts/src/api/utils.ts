
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


export type ApiResult<D> = Promise<AxiosResponse<D|BadRequest|undefined>>
export type SuccessApi = { success: boolean }


/*
export interface ApiData<D> extends AxiosResponse<D> {
    status: 200
}
export interface ApiError extends AxiosResponse<BadRequest> {
    status: Exclude<number, 200>
}
export type ApiResult2<D> = ApiData<D> | ApiError
export type FromApi<D> = Promise<ApiResult2<D>>
*/


