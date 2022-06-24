import React, {useLayoutEffect, useRef} from 'react'
import css from './SpinnerIc.module.scss'
import { ReactComponent as SpinnerSvg } from 'src/assets/icons/spinner.svg'

// USING CSS VARIABLES

const SpinnerIc = (
    {circleColor, indicatorColor, size}
        : {circleColor:string, indicatorColor:string, size?:number}) => {

    const svgRef = useRef<SVGSVGElement>(null)
    useLayoutEffect(()=>{
        const svg = svgRef.current
        if (svg) {
            svg.style.setProperty('--circle-color', circleColor)
            svg.style.setProperty('--indicator-color', indicatorColor)
        }
    },[circleColor,indicatorColor])

    return <SpinnerSvg ref={svgRef} className={css.loading}
                       style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
    />
}
export default SpinnerIc
