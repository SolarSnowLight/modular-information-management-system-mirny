
import {ReactComponent as StarSvg} from "src/assets/icons/star.svg"


const StarIc = (
    { color = 'black', size }: { color?: string, size?: number }
) => {
    return <StarSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                    fill={color} />
}
export default StarIc


