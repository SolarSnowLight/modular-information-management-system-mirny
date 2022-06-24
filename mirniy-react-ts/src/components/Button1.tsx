
import css from './Button1.module.scss'


type Button1Props = {
    w?: string|number
    h?: string|number
    title?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const Button1 = ({
    w = '100%', h = '100%', title, onClick
}: Button1Props) => {
    return <button className={css.btn} onClick={onClick}
                   style={{ width: w, height: h }}>
        {title}
    </button>
}
export default Button1