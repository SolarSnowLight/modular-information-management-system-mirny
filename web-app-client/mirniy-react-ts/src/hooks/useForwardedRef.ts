import React, {useEffect, useRef} from "react";


// use usual ref from forwarded ref
const useForwardedRef = <E>(forwardedRef?: React.ForwardedRef<E>) => {
    const innerRef = useRef<E|null>(null)

    const setRef = (instance: E|null) => {
        innerRef.current = instance
        updateForwardedRef()
    }

    const updateForwardedRef = () => {
        if (typeof forwardedRef === 'function'){
            forwardedRef(innerRef.current)
        } else if (forwardedRef && typeof forwardedRef === 'object'){
            forwardedRef.current = innerRef.current
        }
    }

    useEffect(()=>{
        updateForwardedRef()
    },[forwardedRef])

    // innerRef use to get value as from usual ref
    // setRef pass to component eg <input ref={setRef}/>
    return [innerRef, setRef] as const
}
export default useForwardedRef
