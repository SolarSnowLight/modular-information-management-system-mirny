
import {ReactComponent as SvgIcon} from "src/assets/icons/radio-inactive.svg"
import React from "react";


const RadioInactiveIc = (
    { color = 'black', size }: { color?: string|undefined, size?: number|string|undefined }
) => {
    return <SvgIcon
        style={{ width: size, aspectRatio: '1', maxWidth: '100%', maxHeight: '100%' }}
        fill={color} stroke={color}
    />
}
export default React.memo(RadioInactiveIc)


