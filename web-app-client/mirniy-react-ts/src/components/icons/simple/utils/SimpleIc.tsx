import React from "react";



type SvgProps = React.SVGProps<SVGSVGElement> & { title?: string }
type SvgComponent = React.FunctionComponent<SvgProps>


type SimpleIcProps = {
    mainColor?: string|undefined
    size?: number|string|undefined
}

const SimpleIc = (
    { mainColor, size, SvgComponent, ...props }:
        SimpleIcProps & { SvgComponent: SvgComponent } & SvgProps
) => {
    const { style, ...restProps } = props
    return <SvgComponent
        style={{
            width: size, height: size,
            maxWidth: '100%', maxHeight: '100%',
            fill: mainColor, stroke: mainColor,
            ...style
        }}
        {...restProps}
    />
}
export default React.memo(SimpleIc)
export type { SimpleIcProps }