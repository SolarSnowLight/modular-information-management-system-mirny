import {useState} from "react";

let id = 0
function next(){
    const curr = id
    id = (id+1)%Number.MAX_SAFE_INTEGER
    return curr
}


export const useObjectToKey = () => {

    const [weakMap] = useState(new WeakMap<object,number>())

    const getId = (key: object) => {
        if (!weakMap.has(key)){
            const index = next()
            weakMap.set(key, index)
            return index
        }
        return weakMap.get(key)!
    }

    return getId

}