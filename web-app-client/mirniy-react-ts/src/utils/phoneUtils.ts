
// +79998887766 => +7(999)888-77-66
import {StringBuilder} from "@rrainpath/ts-utils";

const format1 = (phone: string) => {
    if (!phonePattern.test(phone)) throw new Error(`not a phone: ${phone}`)
    return new StringBuilder(phone)
        .insert(-10,'(')
        .insert(-7,')')
        .insert(-4,'-')
        .insert(-2,'-')
        .toString()
}


// valid phone: +cXXXxxxXXxx
const phonePattern = /^\+\d{1,6}\d{10}$/


export const phoneUtils = {
    format1,
}