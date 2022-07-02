
import {ReactComponent as CrossSvg} from "src/assets/icons/cross.svg"


const CrossIc = (
    { color = 'black', size }: { color?: string, size?: number }
) => {
    return <CrossSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                     fill={color} />
}
export default CrossIc


