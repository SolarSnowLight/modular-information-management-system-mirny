


export const wait = async <T>(delay:number, value?:T) => new Promise<T>(resolve => setTimeout(resolve,delay,value))
