import {useAppDispatch, useAppSelector} from "../redux/hooks";
import css from './Login.module.scss'
import {userActions} from "../redux/userReducer";
import {useState} from "react";
import LoadingIc from "../components/icons/LoadingIc";
import {errorsActions2} from "../redux/errorsReducer2";


function Login(){

    const { accessJwt, refreshJwt, user } = useAppSelector(s=>s.user)
    const { login: loginErrors, logout: logoutErrors } = useAppSelector(s=>s.errors2)
    const { login: loginLoading, logout: logoutLoading } = useAppSelector(s=>s.loading2)

    const d = useAppDispatch()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    const onLoginInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(ev.currentTarget.value)
        d(errorsActions2.clearErrors('login'))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions2.clearErrors('login'))
    }


    const makeLogin = () => {
        d(userActions.login(login,password))
    }
    const makeLogout = () => {
        d(userActions.logout())
    }

    //console.log((loginErrors.common.errors??[])[0].code)


    return <div>
        <div>access jwt: {accessJwt+''}</div>
       {/* <div>refresh jwt: {refreshJwt+''}</div>*/}
        {/*<div>userid: {decodeJwt(accessJwt??'').users_id}</div>*/}

        <div>Вход</div>

        { loginLoading && <LoadingIc fill={"#6663ff"} size={30}/> }

        {
            loginErrors.common.length > 0 &&
            <div>
                <span>Common login error: </span>
                <span>code: </span>
                <span style={{color: 'red'}}>{loginErrors.common[0].code} </span>
                <span>message: </span>
                <span style={{color: 'red'}}>{loginErrors.common[0].message} </span>
            </div>
        }

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='login (email)'
                       value={login} onInput={onLoginInput} />
            </div>
            {
                loginErrors.errors.login.length > 0 &&
                <div>
                    <span>Login error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{loginErrors.errors.login[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{loginErrors.errors.login[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='password' type='password'
                       value={password} onInput={onPwdInput}/>
            </div>
            {
                loginErrors.errors.password.length > 0 &&
                <div>
                    <span>Password error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{loginErrors.errors.password[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{loginErrors.errors.password[0].message} </span>
                </div>
            }
        </div>

        <div><button onClick={makeLogin}>Login</button></div>


        <div><button className={css.btn} onClick={makeLogout}>Logout</button></div>
        {
            (logoutErrors.common.length ?? 0) > 0 &&
            <div>
                <span>Common logout error: </span>
                <span>code: </span>
                <span style={{color: 'red'}}>{logoutErrors.common[0].code} </span>
                <span>message: </span>
                <span style={{color: 'red'}}>{logoutErrors.common[0].message} </span>
            </div>
        }
        { logoutLoading && <LoadingIc fill={"#6663ff"} size={30}/> }

    </div>
}

export default Login

