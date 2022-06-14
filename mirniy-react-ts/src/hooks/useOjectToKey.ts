import {useState} from "react";

let cnt = 0
function next(){
    cnt = (cnt+1)%Number.MAX_SAFE_INTEGER
    return cnt
}


export const useObjectToKey = () => {

    const [weakMap] = useState(new WeakMap<object,number>())

    const get = (key: object) => {
        if (!weakMap.has(key)){
            const index = next()
            weakMap.set(key, index)
            return index
        }
        return weakMap.get(key)
    }

    return get

}