
import {ReactComponent as StarFilledSvg} from "src/assets/icons/star-filled.svg"
import React from "react";


const StarFilledIc = (
    { color = 'black', size }: { color?: string, size?: number }
) => {
    return <StarFilledSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                          fill={color} />
}
export default React.memo(StarFilledIc)


