
import css from './Button1.module.scss'
import {CSSProperties} from "react";


type Button1Props = {
    w?: string|number
    h?: string|number
    title?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>


    style?: CSSProperties
}
const Button1 = ({
    w = '100%', h = '100%', title, onClick, style
}: Button1Props) => {
    return <button className={css.btn} onClick={onClick}
                   style={{
                       ...style,
                       width: w, height: h,
                   }}>
        {title}
    </button>
}
export default Button1