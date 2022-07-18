


export class DateTime {
    constructor(
        public year: number,
        public month: number,
        public day: number,
        public hour: number,
        public minute: number,
        public second: number
    ){ }

    public static fromDate(date: Date): DateTime {
        return new DateTime(
            date.getFullYear(), date.getMonth()+1, date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds()
        )
    }

    /*public static from_yyyy_MM_dd_hh_mm(date: string): DateTime {
        return new DateTime(
            +date.substring(0,4), +date.substring(5,7), +date.substring(8,10),
            +date.substring(11,13), +date.substring(14,16), 0
        )
    }*/

    to_yyyy_MM_dd_HH_mm_ss(){
        return `${(this.year+'').padStart(4,'0')}-${(this.month+'').padStart(2,'0')}-${(this.day+'').padStart(2,'0')}T`+
            `${(this.hour+'').padStart(2,'0')}:${(this.minute+'').padStart(2,'0')}:${(this.second+'').padStart(2,'0')}`
    }

    to_yyyy_MM_dd_HH_mm(){
        return `${(this.year+'').padStart(4,'0')}-${(this.month+'').padStart(2,'0')}-${(this.day+'').padStart(2,'0')}T`+
            `${(this.hour+'').padStart(2,'0')}:${(this.minute+'').padStart(2,'0')}`
    }
}