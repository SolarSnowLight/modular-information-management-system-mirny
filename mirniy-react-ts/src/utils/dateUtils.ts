

// from "2022-01-01T00:00"
const from_yyyy_MM_dd_hh_mm = (date: string) => {
    return {
        year: date.substring(0,4),
        month: date.substring(5,7),
        day: date.substring(8,10),
        hour: date.substring(11,13),
        minute: date.substring(14,16),
    }
}

export const dateUtils = {
    from_yyyy_MM_dd_hh_mm,
}