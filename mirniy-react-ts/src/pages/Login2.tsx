
import mirRab2 from 'src/assets/images/mir-rab-2.png'
import css from './Login2.module.scss'
import Input1 from "../components/Input1";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {useState} from "react";
import {errorsActions2} from "../redux/errorsReducer2";
import {userActions} from "../redux/userReducer";
import LoadingIc from "../components/icons/LoadingIc";
import Space from "../components/Space";


// todo crop image, image shadow


function Login2(){

    //const { accessJwt, refreshJwt, user } = useAppSelector(s=>s.user)
    const { login: loginErrors } = useAppSelector(s=>s.errors2)
    const { login: loginLoading } = useAppSelector(s=>s.loading2)

    const d = useAppDispatch()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    const onLoginInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(ev.currentTarget.value)
        d(errorsActions2.addErrors({  login: { common: undefined, errors: { login: undefined } } }))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions2.addErrors({  login: { common: undefined, errors: { password: undefined } } }))
    }


    const makeLogin = () => {
        d(userActions.login(login,password))
    }


    return <div className={css.mainFrame}>

        <div className={css.logoPic} style={{ backgroundImage: `url(${mirRab2})` }}></div>

        <div className={css.formFrame}>
            <div>Вход</div>
            <div>Ещё нет аккаунта?</div><div>Зарегистрироваться</div>

            <Space h={30}/>

            <div className={css.inputBox}>
                <Input1 h={45} title='Email' placeholder='Введите email'
                        value={login} onInput={onLoginInput} hasError={loginErrors.errors.login.length > 0}/>
                <div className={css.errorContainer}>
                    { loginErrors.errors.login.length > 0 && <div className={css.errorContainer2}>
                        { loginErrors.errors.login.map(it=><div className={css.error} key={it.message}>{it.message}</div>) }
                    </div> }
                </div>
            </div>

            <div className={css.inputBox}>
                <Input1 h={45} title='Пароль' placeholder='Введите пароль' hideable hide
                        value={password} onInput={onPwdInput} hasError={loginErrors.errors.password.length > 0}/>
                <div className={css.errorContainer}>
                    { loginErrors.errors.password.length > 0 && <div className={css.errorContainer2}>
                        { loginErrors.errors.password.map(it=><div className={css.error} key={it.message}>{it.message}</div>) }
                    </div> }
                </div>
            </div>

            <div className={css.inputBox}>
                <button onClick={makeLogin}>Login</button>
                { loginLoading && <LoadingIc size={30}/> }
                <div className={css.errorContainer}>
                    { loginErrors.common.length > 0 && <div className={css.errorContainer2}>
                        { loginErrors.common.map(it=><div className={css.error} key={it.message}>{it.message}</div>) }
                    </div> }
                </div>
            </div>


        </div>



    </div>
}
export default Login2

