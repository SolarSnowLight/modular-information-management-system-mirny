import React from "react";
import styled, {css} from "styled-components";
import mirRabLogo from 'src/assets/icons/mir-rab-logo.svg'
import defaultAva from 'src/assets/images/default-ava.jpg'
import Space from "src/components/Space"
import PencilIc from "src/components/icons/PencilIc";
import Input2 from "src/components/Input2";
import {phoneUtils} from "src/utils/phoneUtils";
import {ProfileServ} from "src/api-service/userService";
import {commonStyled} from "src/common-styles/commonStyled";
import { Link } from "react-router-dom";


const ProfileView = ({ profileData }: { profileData: ProfileServ }) => {
    const p = profileData


    return <ProfileFrame>

        <MirRab>
            <MirRabLogo/>
            <Space w={16}/>
            <MirRabTitle>МИРНИНСКИЙ<br/>РАБОЧИЙ</MirRabTitle>
        </MirRab>

        <Space h={40}/>

        { p && <>
            <MainInfoContainer>
                <Ava avaUrl={defaultAva}/>
                <Space w={8}/>
                <TextCol>
                    <Nickname>{p.nickname}</Nickname>
                    <Space h={8}/>
                    <Fio>{p.surname} {p.name} {p.patronymic}</Fio>
                    <Space h={8}/>
                    <Age>{p.sex ? 'Мужчина' : 'Женщина'}, {p.birthDate.getAge()}</Age>
                </TextCol>
                <Link to={'/user/profile/edit'}><PencilFrame>
                    <PencilIc fill='black' size={18}/>
                </PencilFrame></Link>
            </MainInfoContainer>

            <Space h={8}/>

            <Space h={23}/>

            <Input2 {...input2Style}
                    title={'Телефон'} value={phoneUtils.format1(p.phone)} readOnly
            />

            <Space h={23}/>

            <Input2 {...input2Style}
                    title={'E-mail'} value={'<email>'} readOnly
            />

        </> }

    </ProfileFrame>
}
export default React.memo(ProfileView)



const ProfileFrame = React.memo(styled.div`
  ${commonStyled.col}
`)
const MirRab = React.memo(styled.div`
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
const Nickname = React.memo(styled.div`
  font: 500 36px 'TT Commons';
  color: black;
`)
const Fio = React.memo(styled.div`
  font: 400 18px 'TT Commons';
  color: #424041; // Gray1
`)
const PencilFrame = React.memo(styled.div`
  width: 24px; aspect-ratio: 1;
  ${commonStyled.center};
  align-self: flex-start;
  cursor: pointer;
`)
const Age = React.memo(styled.div`
  font: 400 12px 'TT Commons';
  color: #8B8B8B; // Gray2
`)


const input2Style = {
    frameMainStyle: css`width: 380px; height: 45px; border: 1px solid #8B8B8B;`,
    titleStyle: css`font: 400 12px 'TT Commons'; color: #424041; /*Gray1*/`,
    inputStyle: css`font: 500 16px 'TT Commons'; color: black;`,
}