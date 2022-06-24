
import {ReactComponent as LoadingSvg} from "src/assets/icons/loading.svg"
import css from "./LoadingIc.module.scss"




const LoadingIc = (
    { fill = '#6663ff', size }: { fill?: string, size?: number }
) => {
    return <LoadingSvg className={css.loading}
        style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
        fill={fill} stroke={fill}/>
}
export default LoadingIc





//OLD:
/*

.box {
    display: flex;
    align-items: stretch;

}
.box2 {
    display: flex;
    flex-direction: column;
    align-items: stretch;

}


    .box {
    display: grid;
    align-items: stretch;
    justify-items: stretch;
    //aspect-ratio: 1/1;
}
.icon {
    height: 100%;
}
*/
/*return <div className={css.box} style={{height: size, width: size}}>
    <LoadingIcon className={css.loading} fill={fill} stroke={fill}/>
</div>*/

/*return <div className={css.box} style={{height: size, width: size}}>
    <LoadingIcon className={css.loading} fill={fill} stroke={fill}/>
</div>*/




/*
    const iconBoxRef = useRef<HTMLDivElement>(null)
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