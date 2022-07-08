import {css} from "styled-components";


export const absolute = css`
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
`

export const absoluteOff = (offset?: string) => css`
  position: absolute;
  ${offsetToPosition(offset)}
`


function offsetToPosition(offset?: string){
    if (offset){
        const parts = offset.trim().split(/\s+/)
        if (parts.length===2)
            return `top: ${parts[0]}; right: ${parts[1]}; bottom: ${parts[0]}; left: ${parts[1]};`
        if (parts.length===4)
            return `top: ${parts[0]}; right: ${parts[1]}; bottom: ${parts[2]}; left: ${parts[3]};`
    }
    return `top: 0; right: 0; bottom: 0; left: 0;`
}