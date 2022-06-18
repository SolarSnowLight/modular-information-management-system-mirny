import {userActions} from "../redux/userReducer";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import LoadingIc from "../components/icons/LoadingIc";
import {errorsActions2} from "../redux/errorsReducer2";


function Signup(){
    const { accessJwt, refreshJwt, user } = useAppSelector(s=>s.user)
    const { signup: signupErrors } = useAppSelector(s=>s.errors2)
    const { signup: signupLoading } = useAppSelector(s=>s.loading2)
    const d = useAppDispatch()

    const signup = () => {
        d(userActions.signup({ email, password, name, surname }))
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const onEmailInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(ev.currentTarget.value)
        d(errorsActions2.clearErrors('signup'))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions2.clearErrors('signup'))
    }
    const onNameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setName(ev.currentTarget.value)
        d(errorsActions2.clearErrors('signup'))
    }
    const onSurnameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(ev.currentTarget.value)
        d(errorsActions2.clearErrors('signup'))
    }


    return <div>
        <div>access jwt: {accessJwt+''}</div>
        <div>refresh jwt: {refreshJwt+''}</div>
        {/*<div>userid: {decodeJwt(accessJwt??'').users_id}</div>*/}


        <div>Регистрация</div>

        { signupLoading && <LoadingIc fill={"#6663ff"} size={30}/> }

        {
            signupErrors.common.length > 0 &&
            <div>
                <span>Common signup error: </span>
                <span>code: </span>
                <span style={{color: 'red'}}>{signupErrors.common[0].code} </span>
                <span>message: </span>
                <span style={{color: 'red'}}>{signupErrors.common[0].message} </span>
            </div>
        }

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='email'
                       value={email} onInput={onEmailInput}/>
            </div>
            {
                signupErrors.errors.email.length > 0 &&
                <div>
                    <span>Email error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.email[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.email[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='password' type='password'
                       value={password} onInput={onPwdInput}/>
            </div>
            {
                signupErrors.errors.password.length > 0 &&
                <div>
                    <span>Password error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.password[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.password[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='имя'
                       value={name} onInput={onNameInput}/>
            </div>
            {
                signupErrors.errors.name.length > 0 &&
                <div>
                    <span>Name error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.name[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.name[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
                <input placeholder='фамилия'
                       value={surname} onInput={onSurnameInput}/>
            </div>
            {
                signupErrors.errors.surname.length > 0 &&
                <div>
                    <span>Surname error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.surname[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.surname[0].message} </span>
                </div>
            }
        </div>
        {/*<div><input placeholder='отчество'/></div>
        <div><input placeholder='пол'/></div>
        <div><input placeholder='телефон'/></div>
        <div><input placeholder='никнейм'/></div>
        <div><input placeholder='дата рождения'/></div>*/}

        <div>
            <button onClick={signup}>Зарегистрироваться</button>
        </div>

    </div>
}

export default Signup