
import mirRab from 'src/assets/images/mir-rab.png'
import css from './Login.module.scss'
import Input1 from "../../components/Input1";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {useState} from "react";
import {errorsActions} from "../../redux/errorsReducer";
import {userActions} from "../../redux/userReducer";
import Space from "../../components/Space";
import Button1 from "../../components/Button1";
import SpinnerIc from "../../components/icons/SpinnerIc";
import {Link, useNavigate, useSearchParams} from "react-router-dom";


// todo crop image, image shadow


function Login(){

    //console.log('mir-rab', mirRab)
    //console.log('mir-rab', typeof mirRab)

    const d = useAppDispatch()

    const { login: loginErrors } = useAppSelector(s=>s.errors)
    const { login: loginLoading } = useAppSelector(s=>s.loading)


    const [searchParams] = useSearchParams()
    const nav = useNavigate()


    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const onLoginInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(ev.currentTarget.value)
        d(errorsActions.addErrors({  login: { common: undefined, errors: { login: undefined } } }))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions.addErrors({  login: { common: undefined, errors: { password: undefined } } }))
    }


    const makeLogin = async () => {
        const success = await d(userActions.login(login, password))
        if (success) {
            const backPath = searchParams.get("backpath")
            if (backPath) nav(backPath)
        }
    }




    return <div className={css.mainFrame}>

        <div className={css.logoPic} style={{ backgroundImage: `url(${mirRab})` }}></div>

        <div className={css.formFrame}>
            <div className={css.enterTitle}>Вход</div>

            <Space h={12} />

            <div className={css.textContainer}>
                <span className={css.noAccount}>Ещё нет аккаунта?</span>
                <span style={{ whiteSpace: "break-spaces" }}>  </span>
                <Link to='/signup'><span className={css.signup}>
                    Зарегистрироваться
                </span></Link>
            </div>

            <Space h={70}/>

            <div className={css.inputBox}>
                <Input1 h={54} title='Email' placeholder='Введите email'
                        value={login} onInput={onLoginInput} hasError={loginErrors.errors.login.length > 0}/>
                <div className={css.errorContainer}>
                    { loginErrors.errors.login.length > 0 && <div className={css.errorContainer2}>
                        <div className={css.error} key={loginErrors.errors.login[0].message}>{loginErrors.errors.login[0].message}</div>
                        { /*loginErrors.errors.login.map(it=><div className={css.error} key={it.message}>{it.message}</div>)*/ }
                    </div> }
                </div>
            </div>

            <div className={css.inputBox}>
                <Input1 h={54} title='Пароль' placeholder='Введите пароль' hideable hide
                        value={password} onInput={onPwdInput} hasError={loginErrors.errors.password.length > 0}/>
                <div className={css.errorContainer}>
                    { loginErrors.errors.password.length > 0 && <div className={css.errorContainer2}>
                        <div className={css.error} key={loginErrors.errors.password[0].message}>{loginErrors.errors.password[0].message}</div>
                        { /*loginErrors.errors.password.map(it=><div className={css.error} key={it.message}>{it.message}</div>)*/ }
                    </div> }
                </div>
            </div>

            <Space h={12} />

            <div className={css.inputBox}>
                <div className={css.btnBox}>
                    <Button1 h={54} onClick={makeLogin} title={loginLoading?'':'Далее'}/>
                    { loginLoading && <div className={css.spinnerBox}>
                        <SpinnerIc circleColor='#ffffff33' indicatorColor='white' size={24}/>
                    </div> }
                </div>
                <div className={css.errorContainer}>
                    { loginErrors.common.length > 0 && <div className={css.errorContainer2}>
                        <div className={css.error} key={loginErrors.common[0].message}>{loginErrors.common[0].message}</div>
                        { /*loginErrors.common.map(it=><div className={css.error} key={it.message}>{it.message}</div>)*/ }
                    </div> }
                </div>
            </div>

        </div>

    </div>
}
export default Login

