
import {ReactComponent as SvgIcon} from "src/assets/icons/eye-crossed-out.svg"
import React from "react";


const EyeCrossedOutIc = (
    { color = 'black', size }: { color?: string|undefined, size?: number|string|undefined }
) => {
    return <SvgIcon
        style={{ width: size, aspectRatio: '1', maxWidth: '100%', maxHeight: '100%' }}
        fill={color} />
}
export default React.memo(EyeCrossedOutIc)


