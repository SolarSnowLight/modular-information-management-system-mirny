


export class DateTime {
    constructor(
        public year: number,
        public month: number = 0,
        public day: number = 0,
        public hour: number = 0,
        public minute: number = 0,
        public second: number = 0,
    ){ }

    public static fromDate(date: Date): DateTime {
        return new DateTime(
            date.getFullYear(), date.getMonth()+1, date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds()
        )
    }

    public static now(): DateTime {
        return DateTime.fromDate(new Date())
    }

    public static from_dd_MM_yyyy(date: string){
        const match = date.match(dd_MM_yyyy_pattern)
        if (match) return new DateTime(+match.groups!.year!, +match.groups!.month!, +match.groups!.day!)
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

    to_dd_MM_yyyy(){
        return `${(this.day+'').padStart(2,'0')}-${(this.month+'').padStart(2,'0')}-${(this.year+'').padStart(4,'0')}`
    }

    getAge(){
        const now = DateTime.now()
        let age = now.year - this.year
        if (now.month<this.month || (now.month===this.month && now.day<this.day)) age--
        return age
    }
}



const dd_MM_yyyy_pattern = /(?<day>\d{1,2})\D+(?<month>\d{1,2})\D+(?<year>\d{4})/

