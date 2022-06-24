
import {ReactComponent as EyeSvg} from "src/assets/icons/eye.svg"


const EyeIc = (
    { fill = 'black', size }: { fill?: string, size?: number }
) => {
    return <EyeSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                   fill={fill} stroke={fill}/>
}
export default EyeIc


