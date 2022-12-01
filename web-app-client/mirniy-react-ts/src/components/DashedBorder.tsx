import React from "react";
import styled from "styled-components";
import {RawNumVal, RawStrVal, StyleVal} from "src/utils/StyleVal";


export type DashedBorderProps = {
    borderRadius?: RawNumVal
    borderColor?: RawStrVal
    strokeDasharray?: RawStrVal // stroke-dasharray="<ширина штриха>,<ширина пробела>,..."
    borderWidth?: RawNumVal
    cornerSize?: RawNumVal
}

const DashedBorder = (props: DashedBorderProps) => {
    return <Box borderRadius={props.borderRadius}>
        <svg width='100%' height='100%' style={{ position: 'absolute' }}>
            <rect x="0" y="0" width="100%" height="100%"
                  fill="none"
                  rx={props.borderRadius} ry={props.borderRadius}
                  stroke={props.borderColor}
                  strokeWidth={StyleVal.of(props.borderWidth).map(v=>v*2).get()}
                  strokeDasharray={props.strokeDasharray}
                  strokeDashoffset="0"
            />
        </svg>
        { props.cornerSize && <>
            <TopLeft size={props.cornerSize} borderWidth={props.borderWidth} borderColor={props.borderColor}/>
            <TopRight size={props.cornerSize} borderWidth={props.borderWidth} borderColor={props.borderColor}/>
            <BottomRight size={props.cornerSize} borderWidth={props.borderWidth} borderColor={props.borderColor}/>
            <BottomLeft size={props.cornerSize} borderWidth={props.borderWidth} borderColor={props.borderColor}/>
        </> }
    </Box>
}
export default React.memo(DashedBorder)


const Box = React.memo(styled.div<{
    borderRadius?: number|undefined,
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: ${p=>StyleVal.of(p.borderRadius).get('px')};
  overflow: hidden;
`)


const TopLeft = React.memo(styled.div<{
    size?: RawNumVal
    borderWidth?: RawNumVal
    borderColor?: RawStrVal
}>`
  position: absolute; top: 0; left: 0;
  width: ${p=>StyleVal.px(p.size)};
  height: ${p=>StyleVal.px(p.size)};
  border-top: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-left: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-top-left-radius: 4px;
`)
const TopRight = React.memo(styled.div<{
    size?: RawNumVal
    borderWidth?: RawNumVal
    borderColor?: RawStrVal
}>`
  position: absolute; top: 0; right: 0;
  width: ${p=>StyleVal.px(p.size)};
  height: ${p=>StyleVal.px(p.size)};
  border-top: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-right: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-top-right-radius: 4px;
`)
const BottomRight = React.memo(styled.div<{
    size?: RawNumVal
    borderWidth?: RawNumVal
    borderColor?: RawStrVal
}>`
  position: absolute; right: 0; bottom: 0;
  width: ${p=>StyleVal.px(p.size)};
  height: ${p=>StyleVal.px(p.size)};
  border-right: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-bottom: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-bottom-right-radius: 4px;
`)
const BottomLeft = React.memo(styled.div<{
    size?: RawNumVal
    borderWidth?: RawNumVal
    borderColor?: RawStrVal
}>`
  position: absolute; left: 0; bottom: 0;
  width: ${p=>StyleVal.px(p.size)};
  height: ${p=>StyleVal.px(p.size)};
  border-left: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-bottom: ${p=>StyleVal.px(p.borderWidth)} solid ${p=>p.borderColor};
  border-bottom-left-radius: 4px;
`)


