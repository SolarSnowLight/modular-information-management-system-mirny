import React from "react"
import {ReactComponent as LoadingIcon} from "src/assets/icons/loading-ic.svg"
import css from "./Ic.module.scss"




// Необходимо непосредственно задать размер контейнеру иконки
const LoadingIc = ({fill, size}: {fill:string, size?: number}) => {

    return <div className={css.box} style={{width: size, height: size}}>
        <LoadingIcon className={css.icon +" "+ css.loading} fill={fill} stroke={fill}/>
    </div>

    /*return <div className={css.box} style={{height: size, width: size}}>
        <LoadingIcon className={css.loading} fill={fill} stroke={fill}/>
    </div>*/

    /*return <div className={css.box} style={{height: size, width: size}}>
        <LoadingIcon className={css.loading} fill={fill} stroke={fill}/>
    </div>*/




    /*const iconBoxRef = useRef<HTMLDivElement>(null)
    const iconBox = iconBoxRef.current


    const realW = iconBox?iconBox.clientWidth:undefined
    const realH = iconBox?iconBox.clientHeight:undefined

    console.log(realW)
    console.log(realH)

    const [w, setW] = useState(realW?realW:"auto")
    const [h, setH] = useState(realH?realH:"auto")

    useEffect(()=>{
        if (realH && realH>0) setW(realH)
        else if (realW && realW>0) setH(realW)
    },[realW,realH])



    return <div ref={iconBoxRef} className={css.grid}
                style={{width: w, height: h}}>
        <LoadingIcon className={css.loading} fill={fill} stroke={fill}/>
    </div>
*/


}

export default LoadingIc