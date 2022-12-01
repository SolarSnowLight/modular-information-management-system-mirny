import React, {useEffect, useId, useRef, useState} from "react";
import styled, {css} from "styled-components";
import defaultAva from 'src/assets/images/ava-default.jpg'
import Space from "src/components/Space"
import {phoneUtils} from "src/utils/phoneUtils";
import {ProfileServ, userService} from "src/api-service/userService";
import {commonStyled} from "src/styles/commonStyled";
import InputRadio from "src/components/InputRadio";
import Button1 from "src/components/Button1";
import SpinnerIc from "src/components/icons/SpinnerIc";
import {errorValidation} from "src/utils/errorValidation";
import {profileEditValidation} from "src/pages/Profile/sub-components/ProfileEditValidation";
import {DateTime} from "src/utils/DateTime";
import MirRabEmblem from "src/components/MirRabEmblem";
import {toastifyUtils} from "src/utils/toastifyUtils";
import {Input3a} from "src/components/Input3";




const ProfileEdit = ({ profileData, setProfileData }: {
    profileData: ProfileServ,
    setProfileData: (profileData: ProfileServ)=>void
}) => {
    const p = profileData
    const id = useId()

    const [name, setName] = useState(p.name)
    const onNameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, name: [], common: []})
        setName(ev.target.value)
    }

    const [surname, setSurname] = useState(p.surname)
    const onSurnameInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, surname: [], common: []})
        setSurname(ev.target.value)
    }

    const [patronymic, setPatronymic] = useState(p.patronymic)
    const onPatronymicInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, patronymic: [], common: []})
        setPatronymic(ev.target.value)
    }

    const [day, setDay] = useState(p.birthDate.day+'')
    const onDayInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, day: [], common: []})
        setDay(ev.target.value)
    }

    const [month, setMonth] = useState(p.birthDate.month+'')
    const onMonthInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, month: [], common: []})
        setMonth(ev.target.value)
    }

    const [year, setYear] = useState(p.birthDate.year+'')
    const onYearInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, year: [], common: []})
        setYear(ev.target.value)
    }

    const [sex, setSex] = useState(p.sex)

    const [nick, setNick] = useState(p.nickname+'')
    const onNickInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, nick: [], common: []})
        setNick(ev.target.value)
        // todo remove it
        /*if (nickRef.current) {
            nickRef.current.selectionStart = 0
            nickRef.current.selectionEnd = 0
        }*/
    }

    const [pwd, setPwd] = useState('')
    const onPwdInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        //console.log("i'm here")
        setErrors({...errors, pwd: [], common: []})
        setPwd(ev.target.value)
    }

    const [pwd2, setPwd2] = useState('')
    const onPwd2Input = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setErrors({...errors, pwd2: [], common: []})
        setPwd2(ev.target.value)
    }

    const [errors, setErrors] = useState(profileEditValidation.initialErrors())
    const [loading, setLoading] = useState(false)

    const makeProfileUpdate = async () => {
        if (loading) return; setLoading(true);
        try {
            const values = {
                name, surname, patronymic,
                day, month, year,
                nick, pwd, pwd2,
            }
            const newErrors = await profileEditValidation.checkOnErrors(values)
            setErrors(newErrors)
            if (errorValidation.hasError(newErrors)) return

            const r = await userService.updateProfile({
                email: p.email,
                name: name,
                surname: surname,
                patronymic: patronymic,
                sex: sex,
                phone: p.phone,
                nickname: nick,
                birthDate: new DateTime(+year,+month,+day)
            })

            if (r.type==='error'){
                const errors = profileEditValidation.initialErrors()
                errors.common.push(r.error)
                setErrors(errors)
                return
            }

            setProfileData(r.data)

        } finally { setLoading(false) }
    }

    useEffect(()=>{
        if (errors.common.length>0) errors.common.forEach(it=>toastifyUtils.errorToast(it.message))
    },[errors.common])

    const nickRef = useRef<HTMLInputElement>(null)

    return <ProfileFrame>

        <Space h={96}/>

        <MirRabEmblem/>

        <Space h={40}/>


        <MainInfoContainer>
            <Ava avaUrl={defaultAva}/>
            <Space w={16}/>
            <TextCol>
                <PhotoAction onClick={toastifyUtils.notImplementedToast}>
                    Загрузить новое фото
                </PhotoAction>
                <Space h={8}/>
                <PhotoAction onClick={toastifyUtils.notImplementedToast}>
                    Удалить фото
                </PhotoAction>
            </TextCol>
        </MainInfoContainer>

        <Space h={47}/>

        <Input3a title='Ник пользователя' value={nick} onInput={onNickInput}
                 placeholder='Введите ник'
                 hasError={errors.nick.length>0} ref={nickRef}/>

        <ErrorContainer>
            { errors.nick.length>0 && errors.nick[0].message }
        </ErrorContainer>

        <Input3a title='Имя' value={name} onInput={onNameInput}
                 placeholder='Введите имя'
                 hasError={errors.name.length>0}
        />

        <ErrorContainer>
            { errors.name.length>0 && errors.name[0].message }
        </ErrorContainer>

        <Input3a title='Фамилия' value={surname} onInput={onSurnameInput}
                 placeholder='Введите фамилию'
                 hasError={errors.surname.length>0}
        />

        <ErrorContainer>
            { errors.surname.length>0 && errors.surname[0].message }
        </ErrorContainer>

        <Input3a title='Отчество' value={patronymic} onInput={onPatronymicInput}
                 placeholder='Введите отчество'
                 hasError={errors.patronymic.length>0}
        />

        <ErrorContainer>
            { errors.patronymic.length>0 && errors.patronymic[0].message }
        </ErrorContainer>

        <BirthDateBox>
            <Input3a styled={ css`width: 96px;` }
                     title={'День'} value={day} onInput={onDayInput}
                     hasError={errors.day.length>0}
            />
            <Input3a styled={ css`width: 96px;` }
                     title={'Месяц'} value={month} onInput={onMonthInput}
                     hasError={errors.month.length>0}
            />
            <Input3a styled={ css`width: 172px;` }
                     title={'Год'} value={year} onInput={onYearInput}
                     hasError={errors.year.length>0}
            />
        </BirthDateBox>

        <ErrorContainer>
            {
                errors.year.length>0 && errors.year[0].message
                || errors.month.length>0 && errors.month[0].message
                || errors.day.length>0 && errors.day[0].message
            }
        </ErrorContainer>

        <SexTitle>Пол</SexTitle>

        <Space h={13}/>

        <SexBox>
            <Space w={2}/>
            <InputRadio checked={!sex} onChange={()=>setSex(false)}
                        name={`${id}-sex`} value='female' id={`${id}-female`}
                        styled={css`width: 20px; height: 20px;`}
            />
            <SexText htmlFor={`${id}-female`}>Женский</SexText>
            <Space flexGrow={1}/>
            <InputRadio checked={sex} onChange={()=>setSex(true)}
                        name={`${id}-sex`} value='male' id={`${id}-male`}
                        styled={css`width: 20px; height: 20px;`}
            />
            <SexText htmlFor={`${id}-male`}>Мужской</SexText>
        </SexBox>

        <Space h={23}/>

        <Input3a styled={css`[id$=input-box] input{ color:#8B8B8B; }`}
                 title='Телефон' value={phoneUtils.format1(p.phone)} readOnly
                 placeholder='+7 xxx xxx xx xx'
        />

        <Space h={23}/>

        <Input3a styled={css`[id$=input-box] input{ color:#8B8B8B; }`}
                 title='E-mail' value={p.email} readOnly
                 placeholder='Введите e-mail'
        />

        <Space h={23}/>

        {/* todo make custom placeholder symbols */}
        <Input3a styled={css`[id$=placeholder-box] div{ color:black; }`}
                 type='password' enableHideSwitch
                 title='Пароль' value={pwd} onInput={onPwdInput}
                 placeholder='* * * * * * * * * *'
                 hasError={errors.pwd.length>0}
        />

        <ErrorContainer>
            { errors.pwd.length>0 && errors.pwd[0].message }
        </ErrorContainer>

        <Input3a styled={css`[id$=placeholder-box] div{ color:black; }`}
                 type='password' enableHideSwitch
                 title='Повторите пароль' value={pwd2} onInput={onPwd2Input}
                 placeholder='* * * * * * * * * *'
                 hasError={errors.pwd2.length>0}
        />

        <ErrorContainer style={{ minHeight: 50}}>
            { errors.pwd2.length>0 && errors.pwd2[0].message }
        </ErrorContainer>


        <BtnBox>
            <ActionButton onClick={makeProfileUpdate}>{loading?'':'Сохранить'}</ActionButton>
            { loading && <SpinnerBox>
                <SpinnerIc circleColor='#ffffff33' indicatorColor='white' size={24}/>
            </SpinnerBox> }
        </BtnBox>

        <ErrorContainer>
            { errors.common.length>0 && errors.common[0].message }
        </ErrorContainer>

        <Space h={73}/>

    </ProfileFrame>
}
export default React.memo(ProfileEdit)



const ProfileFrame = React.memo(styled.div`
  ${commonStyled.col}
`)
const MainInfoContainer = React.memo(styled.div`
  ${commonStyled.row};
  width: 380px; height: fit-content;
`)
const Ava = React.memo(styled.div<{ avaUrl: string }>`
  aspect-ratio: 1; height: 102px;
  background-image: url("${p=>p.avaUrl}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
`)
const TextCol = React.memo(styled.div`
  ${commonStyled.col};
  flex-grow: 1; height: fit-content;
`)
const PhotoAction = React.memo(styled.div`
  font: 400 14px 'TT Commons';
  color: #8B8B8B;
  cursor: pointer;
  :hover {
    text-decoration-line: underline;
  }
`)


const BirthDateBox = React.memo(styled.div`
  width: 380px; height: fit-content;
  ${commonStyled.row};
  justify-content: space-between;
`)
const SexTitle = React.memo(styled.div`
  font: 400 14px 'TT Commons';
  color: #424041; // Gray1
`)
const SexBox = React.memo(styled.div`
  ${commonStyled.row};
`)
const SexText = React.memo(styled.label`
  font: 500 16px 'TT Commons';
  color: black;
  cursor: pointer;
  padding-left: 6px;
`)


const BtnBox = React.memo(styled.div`
  position: relative;
`)
const ActionButton = React.memo(styled(Button1)`
  width: 380px; height: 42px;
  font: 600 18px "TT Commons";
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