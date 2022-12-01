

type RawNumVal = string|number|undefined
type RawStrVal = string|undefined
type NumVal = number|undefined
type Unit = string|undefined

export class StyleVal {
    original: RawNumVal
    numberVal: NumVal
    unit: Unit

    private constructor() { }


    static of(value: RawNumVal, defaultValue?: RawNumVal){
        const sv = new StyleVal()
        sv.parseAndSet(value)
        sv.withDefault(defaultValue)
        return sv
    }
    withDefault(defaultValue: RawNumVal){
        if (this.numberVal===undefined){
            this.parseAndSet(defaultValue)
        }
        return this
    }
    map(mapper: (numVal: number)=>number){
        if (this.numberVal!==undefined) this.numberVal = mapper(this.numberVal)
        return this
    }
    get(defaultUnit?: string){
        if (this.numberVal===undefined) return this.original
        if (this.unit===undefined) {
            if (defaultUnit!==undefined) return this.numberVal+defaultUnit
            return this.numberVal
        }
        return this.numberVal+this.unit
    }
    getWith(unit: string){
        if (this.numberVal===undefined) return this.original
        return this.numberVal+unit
    }
    px(){ return this.getWith('px') }

    private parseAndSet(value: RawNumVal){
        const parsed = StyleVal.parse(value)
        this.original = value
        this.numberVal = parsed.numberVal
        this.unit = parsed.unit
    }

    private static parse(value: RawNumVal){
        if (Number.isFinite(value)) return { numberVal: value as number, unit: undefined }
        if (typeof value === 'string'){
            const result = value.match(cssNumberPattern)
            if (result) {
                let numberVal = +result.groups!.num!
                let unit = result.groups!.unit as string|undefined
                return { numberVal, unit }
            }
        }
        return { numberVal: undefined, unit: undefined }
    }




    static px = (val: RawNumVal) => StyleVal.of(val).get('px')
}

export type {
    RawNumVal,
    RawStrVal,
}


const cssNumberPattern = /^(?<num>[+-]?(\d+(\.\d+)?)|(\.\d+))(?<unit>%|(px)|(em)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(fr)|(ex)|(ch)|(mm)|(cm)|(pt)|(pc)*)?$/i
