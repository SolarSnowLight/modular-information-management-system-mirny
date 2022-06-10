import {useAppDispatch, useAppSelector} from "../redux/hooks";
import css from './Login.module.scss'
import {userActions} from "../redux/userSlice";


function Login(){

    const { jwt, user } = useAppSelector(s=>s.user)
    const d = useAppDispatch()

    const login = () => {
        d(userActions.login("s","s"))
    }
    const logout = () => {
        d(userActions.logout())
    }

    return <>
        <div>jwt: {jwt+''}</div>
        <div>username: {user?.name+''}</div>
        <div>Вход</div>
        <div><input placeholder='login (email)'/></div>
        <div><input placeholder='password' type='password'/></div>
        <div><button onClick={login}>Login</button></div>
        <div><button className={css.btn} onClick={logout}>Logout</button></div>
    </>
}

export default Login