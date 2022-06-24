
import {ReactComponent as EyeCrossedOutSvg} from "src/assets/icons/eye-crossed-out.svg"


const EyeCrossedOutIc = (
    { fill = 'black', size }: { fill?: string, size?: number }
) => {
    return <EyeCrossedOutSvg style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
                             fill={fill} stroke={fill}/>
}
export default EyeCrossedOutIc


