import css from './Header.module.scss'
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {userActions} from "../../redux/userReducer";
import Space from "../../components/Space";




function Header(){

    const d = useAppDispatch()

    const accessJwt = useAppSelector(s=>s.user.accessJwt)

    const makeLogout = () => {
        d(userActions.logout())
    }

    return <div className={css.frame}>
        <div className={css.header}>

            <div className={css.text}>accessJwt: {accessJwt+''}</div>
            <Space w={20}/>
            <div>
                <button onClick={makeLogout}>Logout</button>
            </div>

        </div>
    </div>
}
export default Header