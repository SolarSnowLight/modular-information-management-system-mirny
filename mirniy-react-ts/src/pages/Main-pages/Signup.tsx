import {userActions} from "../../redux/userReducer";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import LoadingIc from "../../components/icons/LoadingIc";
import {errorsActions} from "../../redux/errorsReducer";


function Signup(){
    const { accessJwt, user } = useAppSelector(s=>s.user)
    const { signup: signupErrors } = useAppSelector(s=>s.errors)
    const { signup: signupLoading } = useAppSelector(s=>s.loading)
    const d = useAppDispatch()

    const signup = () => {
        d(userActions.signup({
            email, password, name, surname, patronymic, nickname, sex, phone, birthDate
        }))
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [nickname, setNickname] = useState('')
    const [sex, setSex] = useState(true)
    const [phone, setPhone] = useState('+7')
    const [birthDate, setBirthDate] = useState('')
    const onEmailInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { email: undefined } } }))
    }
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { password: undefined } } }))
    }
    const onNameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setName(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { name: undefined } } }))
    }
    const onSurnameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSurname(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { surname: undefined } } }))
    }
    const onPatronymicInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPatronymic(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { patronymic: undefined } } }))
    }
    const onNicknameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { nickname: undefined } } }))
    }
    const onSexInput = (isMale: boolean) => {
        setSex(isMale)
        d(errorsActions.addErrors({ signup: { common: undefined } }))
    }
    const onPhoneInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { phone: undefined } } }))
    }
    const onBirthDateInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setBirthDate(ev.currentTarget.value)
        d(errorsActions.addErrors({ signup: { common: undefined, errors: { birthDate: undefined } } }))
    }


    return <div>
        <div>access jwt: {accessJwt+''}</div>
        {/*<div>refresh jwt: {refreshJwt+''}</div>*/}
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

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <input placeholder='отчество'
                   value={patronymic} onInput={onPatronymicInput}/>
            {
                signupErrors.errors.patronymic.length > 0 &&
                <div>
                    <span>Patronymic error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.patronymic[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.patronymic[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <input placeholder='никнейм'
                   value={nickname} onInput={onNicknameInput}/>
            {
                signupErrors.errors.nickname.length > 0 &&
                <div>
                    <span>Nickname error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.nickname[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.nickname[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <span>Пол:</span>
            <span> </span>
            <input type='radio' name='sex' value='М' id='male'
                    checked={sex} onChange={()=>onSexInput(true)} />
            <span> </span>
            <label htmlFor='male'>М</label>
            <span> </span>
            <input type='radio' name='sex' value='Ж' id='female'
                    checked={!sex} onChange={()=>onSexInput(false)} />
            <span> </span>
            <label htmlFor='female'>Ж</label>
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <input placeholder='телефон +7-987-654-32-10'
                   value={phone} onInput={onPhoneInput}/>
            {
                signupErrors.errors.phone.length > 0 &&
                <div>
                    <span>Phone error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.phone[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.phone[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <input placeholder='дата рождения'
                   value={birthDate} onInput={onBirthDateInput}/>
            {
                signupErrors.errors.birthDate.length > 0 &&
                <div>
                    <span>Birth Date error: </span>
                    <span>code: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.birthDate[0].code} </span>
                    <span>message: </span>
                    <span style={{color: 'red'}}>{signupErrors.errors.birthDate[0].message} </span>
                </div>
            }
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
            <button onClick={signup}>Зарегистрироваться</button>
        </div>

    </div>
}

export default Signup