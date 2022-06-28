
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



export type GraphQlData<D> = {
    errors?: Array<{
        message: string,
        locations: Array<{ line: number, column: number }>,
        path: string[],
        extensions: { classification: 'InvalidSyntax' | 'INTERNAL_ERROR' | string }
    }>
    data?: D
}