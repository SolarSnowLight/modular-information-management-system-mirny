
import {ReactComponent as SvgIcon} from "src/assets/icons/pencil.svg"
import React from "react";


const PencilIc = (
    { fill = 'black', size }: { fill?: string, size?: number }
) => {
    return <SvgIcon style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                    fill={fill} stroke={fill}/>
}
export default React.memo(PencilIc)


