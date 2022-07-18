import React, {useEffect, useState} from "react";


type AsyncImgProps = React.HTMLAttributes<HTMLImageElement> & {
    src?: string|undefined | Promise<string|undefined>
}
const AsyncImg = React.forwardRef<HTMLImageElement, AsyncImgProps>(
    (props, ref) => {
        const { src, ...restProps } = props

        const [finalSrc, setFinalSrc] = useState(undefined as undefined|string)
        useEffect(()=>{
            if (!(src instanceof Promise)){
                setFinalSrc(src)
                return
            }
            let cancel = false
            ;(async () => {
                const url = await src
                if (!cancel) setFinalSrc(url)
            })()
            return ()=>{ cancel=true }
        },[src])

        return <img ref={ref} src={finalSrc} {...restProps} />
})
export default React.memo(AsyncImg)