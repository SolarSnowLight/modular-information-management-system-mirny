import React, {useState} from "react";
import styled, {css} from "styled-components";
import {commonStyled} from "src/common-styles/commonStyled";
import Space from "src/components/Space";
import mirRabLogo from 'src/assets/icons/mir-rab-logo.svg'
import Input2, {Input2CustomProps} from "src/components/Input2";
import {pwdRecoveryGetUserDataValidation} from "src/pages/PasswordRecovery/PwdRecoveryGetUserDataValidation";
import SpinnerIc from "src/components/icons/SpinnerIc";
import {errorValidation} from "src/utils/errorValidation";
import {userService} from "src/api-service/userService";
import Button1 from "src/components/Button1";




const PwdRecoveryGetUserData = () => {
    const [email, setEmail] = useState('')
    const onEmailInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, email: [], common: []})
        setEmail(ev.target.value)
    }

    const [errors, setErrors] = useState(pwdRecoveryGetUserDataValidation.getInitialErrors())
    const [loading, setLoading] = useState(false)

    const [requested, setRequested] = useState(false)

    const sendEmail = async () => {
        if (loading) return;
        setLoading(true)
        try {
            const values = { email }
            const newErrors = await pwdRecoveryGetUserDataValidation.checkOnErrors(values)
            setErrors(newErrors)
            if (errorValidation.hasError(newErrors)) return

            const r = await userService.sendUserDataToRecoveryPwd({ email })

            if (r.type==='error'){
                const errors = pwdRecoveryGetUserDataValidation.getInitialErrors()
                errors.common.push(r.error)
                setErrors(errors)
                return
            }

            setRequested(true)

        } finally { setLoading(false) }
    }

    return <Page>
        <MainFrame>

            <Space h={40}/>

            <MirRabEmblem>
                <MirRabLogo/>
                <Space w={16}/>
                <MirRabTitle>МИРНИНСКИЙ<br/>РАБОЧИЙ</MirRabTitle>
            </MirRabEmblem>

            <Space h={40}/>

            <MainTitle>Восстановление пароля</MainTitle>

            <Space h={47}/>

            <Input2 {...input2Style} {...(requested ? { readOnly: true } : {})}
                    title={'E-mail'} value={email} onInput={onEmailInput}
                    placeholder={'Введите e-mail'}
            />

            <ErrorContainer>
                { errors.email.length>0 && errors.email[0].message }
            </ErrorContainer>

            <BtnBox>
                <ActionButton onClick={sendEmail} {...(requested ? { disabled: true } : {})}>
                    {loading?'':'Далее'}
                </ActionButton>
                { loading && <SpinnerBox>
                    <SpinnerIc circleColor='#ffffff33' indicatorColor='white' size={24}/>
                </SpinnerBox> }
            </BtnBox>

            <ErrorContainer>
                { errors.common.length>0 && `Ошибка: ${errors.common[0].message}` }
            </ErrorContainer>

            { requested && <Message>
                Проверьте почту и следуйте инструкциям в письме чтобы восстановить пароль !!!
            </Message> }

            <Space h={23}/>

        </MainFrame>
    </Page>
}
export default React.memo(PwdRecoveryGetUserData)


const Page = React.memo(styled.div`
  min-width: 100%; min-height: 100vh;
  ${commonStyled.center};
  background: #FCFCFC;
`)
const MainFrame = React.memo(styled.div`
  ${commonStyled.col};
  width: fit-content; height: fit-content;
`)


const MirRabEmblem = React.memo(styled.div`
  ${commonStyled.row};
  width: 380px;
`)
const MirRabLogo = React.memo(styled.div`
  width: 30px; aspect-ratio: 1;
  background-image: url(${mirRabLogo});
  background-position: right;
  background-repeat: no-repeat;
  background-size: cover;
`)
const MirRabTitle = React.memo(styled.div`
  font: 400 18px 'TT Commons';
`)

const MainTitle = React.memo(styled.div`
  width: 380px;
  font: 500 36px 'TT Commons';
  color: #424041; // Gray1
`)



const input2Style: Input2CustomProps = {
    frameMainStyle: css`width: 380px; height: 45px; :before{border: 1px solid #8B8B8B;} `,
    frameErrorStyle: css`:before{border: 1px solid #EE1D23;}`,
    titleStyle: css`font: 400 12px 'TT Commons'; color: #424041; /*Gray1*/`,
    placeholderStyle: css`font: 500 16px 'TT Commons'; color: #8B8B8B; /*Gray2*/`,
    inputStyle: css`
      font: 500 16px 'TT Commons'; 
      color: black;
      &[readonly]{color: #8B8B8B;}
    `,
    hideIcColor: '#8B8B8B',
    showIcColor: '#8B8B8B',
}


const Message = React.memo(styled.div`
  width: 380px;
  font: 400 16px 'TT Commons';
  color: black;
`)

const BtnBox = React.memo(styled.div`
  position: relative;
`)
const ActionButton = React.memo(styled(Button1)`
  width: 380px; height: 42px;
  font: 600 18px "TT Commons";
  :disabled {
    background: transparent;
    border: 1px solid #8B8B8B; /* Gray2 */
    color: #8B8B8B; /* Gray2 */
    cursor: auto;
  }
`)
const SpinnerBox = React.memo(styled.div`
  ${commonStyled.abs};
  ${commonStyled.center};
`)

const ErrorContainer = React.memo(styled.div`
  width: 380px; min-height: 23px;
  padding-top: 2px;
  font: 400 12px 'TT Commons';
  color: #EE1D23;
`)