import {useAppDispatch, useAppSelector} from "../redux/hooks";
import css from './Login.module.scss'
import {userActions} from "../redux/userSlice";
import {useState} from "react";
import {errorsActions} from "../redux/errorsSlice";


function Login(){

    const { accessJwt, refreshJwt, user } = useAppSelector(s=>s.user)
    const loginErrors = useAppSelector(s=>s.errors.login)
    const d = useAppDispatch()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    const onLoginInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(ev.currentTarget.value)
        d(errorsActions.clearErrors('login'))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions.clearErrors('login'))
    }


    const makeLogin = () => {
        d(userActions.login(login,password))
    }
    const makeLogout = () => {
        d(userActions.logout())
    }


    return <>
        <div>aceess jwt: {accessJwt+''}</div>
        <div>refresh jwt: {refreshJwt+''}</div>
        <div>username: {user?.name+''}</div>

        {
            // @ts-ignore
            loginErrors.errors?.length > 0 &&
            <div>
                <span>Common error: </span>
                <span>code: </span>
                { /*@ts-ignore*/ }
                <span style={{color: 'red'}}>{loginErrors.errors[0].code}</span>
                { /*@ts-ignore*/ }
                <span>message: </span>
                { /*@ts-ignore*/ }
                <span style={{color: 'red'}}>{loginErrors.errors[0].message}</span>
            </div>
        }

        <div>Вход</div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='login (email)'
                       value={login} onInput={onLoginInput} />
            </div>
            {
                // @ts-ignore
                loginErrors.errors.login.errors?.length > 0 &&
                <div>
                    <span>Login error: </span>
                    <span>code: </span>
                    { /*@ts-ignore*/ }
                    <span style={{color: 'red'}}>{loginErrors.errors.login.errors[0].code}</span>
                    { /*@ts-ignore*/ }
                    <span>message: </span>
                    { /*@ts-ignore*/ }
                    <span style={{color: 'red'}}>{loginErrors.errors.login.errors[0].message}</span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='password' type='password'
                       value={password} onInput={onPwdInput}/>
            </div>
            {
                // @ts-ignore
                loginErrors.errors.password.errors?.length > 0 &&
                <div>
                    <span>Password error: </span>
                    <span>code: </span>
                    { /*@ts-ignore*/ }
                    <span style={{color: 'red'}}>{loginErrors.errors.password.errors[0].code} </span>
                    { /*@ts-ignore*/ }
                    <span>message: </span>
                    { /*@ts-ignore*/ }
                    <span style={{color: 'red'}}>{loginErrors.errors.password.errors[0].message} </span>
                </div>
            }
        </div>

        <div><button onClick={makeLogin}>Login</button></div>
        <div><button className={css.btn} onClick={makeLogout}>Logout</button></div>
    </>
}

export default Login

