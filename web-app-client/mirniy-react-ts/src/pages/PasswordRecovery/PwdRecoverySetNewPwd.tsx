import React, {useState} from "react";
import styled from "styled-components";
import {commonStyled} from "src/styles/commonStyled";
import Space from "src/components/Space";
import {pwdRecoverySetNewPwdValidation} from "src/pages/PasswordRecovery/PwdRecoverySetNewPwdValidation";
import SpinnerIc from "src/components/icons/SpinnerIc";
import {errorValidation} from "src/utils/errorValidation";
import {userService} from "src/api-service/userService";
import {Button1a} from "src/components/Button1";
import {Input3a} from "src/components/Input3";
import {useNavigate, useParams} from "react-router-dom";
import MirRabEmblem from "src/components/MirRabEmblem";




const PwdRecoverySetNewPwd = () => {

    const { pwdToken } = useParams()
    const nav = useNavigate()

    const [pwd, setPwd] = useState('')
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, pwd: [], common: []})
        setPwd(ev.target.value)
    }

    const [pwd2, setPwd2] = useState('')
    const onPwd2Input = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, pwd2: [], common: []})
        setPwd2(ev.target.value)
    }

    const [errors, setErrors] = useState(pwdRecoverySetNewPwdValidation.getInitialErrors())
    const [loading, setLoading] = useState(false)

    const sendNewPwd = async () => {
        if (loading) return; setLoading(true)
        try {
            const values = { pwd, pwd2 }
            const newErrors = await pwdRecoverySetNewPwdValidation.checkOnErrors(values)
            setErrors(newErrors)
            if (errorValidation.hasError(newErrors)) return

            const r = await userService.setNewPwd({ pwd: pwd, pwdToken: pwdToken??'' })

            if (r.type==='error'){
                const errors = pwdRecoverySetNewPwdValidation.getInitialErrors()
                errors.common.push(r.error)
                setErrors(errors)
                return
            }

            nav('/')

        } finally { setLoading(false) }
    }

    return <Page>
        <MainFrame>

            <Space h={96}/>

            <MirRabEmblem/>

            <Space h={40}/>

            <MainTitle>Восстановление пароля</MainTitle>

            <Space h={47}/>

            <Input3a type={'password'} allowHideSwitch hasError={errors.pwd.length>0}
                     title='Пароль' value={pwd} onInput={onPwdInput}
                     placeholder={'Введите новый пароль'} />

            <ErrorContainer>
                { errors.pwd.length>0 && errors.pwd[0].message }
            </ErrorContainer>

            <Input3a type={'password'} allowHideSwitch hasError={errors.pwd2.length>0}
                     title='Повторите пароль' value={pwd2} onInput={onPwd2Input}
                     placeholder={'Повторите новый пароль'} />

            <ErrorContainer style={{minHeight: 40}}>
                { errors.pwd2.length>0 && errors.pwd2[0].message }
            </ErrorContainer>

            <BtnBox>
                <Button1a onClick={sendNewPwd} >
                    {loading?'':'Сменить пароль'}
                </Button1a>
                { loading && <SpinnerBox>
                    <SpinnerIc circleColor='#ffffff33' indicatorColor='white' size={24}/>
                </SpinnerBox> }
            </BtnBox>

            <ErrorContainer style={{minHeight: 32}}>
                { errors.common.length>0 && `Ошибка: ${errors.common[0].message}` }
            </ErrorContainer>

            <Space h={64}/>

        </MainFrame>
    </Page>
}
export default React.memo(PwdRecoverySetNewPwd)


const Page = React.memo(styled.div`
  min-width: 100%; min-height: 100vh;
  ${commonStyled.center};
  background: #FCFCFC;
`)
const MainFrame = React.memo(styled.div`
  ${commonStyled.col};
  width: fit-content; height: fit-content;
`)




const MainTitle = React.memo(styled.div`
  width: 380px;
  font: 500 36px 'TT Commons';
  color: #424041; // Gray1
`)





const BtnBox = React.memo(styled.div`
  position: relative;
`)
const SpinnerBox = React.memo(styled.div`
  ${commonStyled.abs};
  ${commonStyled.center};
`)

const ErrorContainer = React.memo(styled.div`
  width: 380px; min-height: 22px;
  padding-top: 2px;
  font: 400 12px 'TT Commons';
  color: #EE1D23;
`)