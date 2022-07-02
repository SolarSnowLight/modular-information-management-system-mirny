import css from './Header.module.scss'
import {useAppDispatch, useAppSelector} from "src/redux/hooks";
import {userActions} from "src/redux/userReducer";
import Space from "src/components/Space";
import Header from "../../components/Header";




function MainHeader(){

    const d = useAppDispatch()

    const accessJwt = useAppSelector(s=>s.user.accessJwt)

    const makeLogout = () => {
        d(userActions.logout())
    }

    return <Header>
        <div className={css.text}>accessJwt: {accessJwt+''}</div>
        <Space w={20}/>
        <div>
            <button onClick={makeLogout}>Logout</button>
        </div>
    </Header>
}
export default MainHeader