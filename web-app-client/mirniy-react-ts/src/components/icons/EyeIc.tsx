
import {ReactComponent as EyeSvg} from "src/assets/icons/eye.svg"
import React from "react";


const EyeIc = (
    { fill = 'black', size }: { fill?: string, size?: number }
) => {
    return <EyeSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                   fill={fill} stroke={fill}/>
}
export default React.memo(EyeIc)


