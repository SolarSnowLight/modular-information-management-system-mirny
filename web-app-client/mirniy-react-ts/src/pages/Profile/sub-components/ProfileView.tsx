import React from "react";
import styled from "styled-components";
import defaultAva from 'src/assets/images/ava-default.jpg'
import Space from "src/components/Space"
import PencilIc from "src/components/icons/PencilIc";
import {phoneUtils} from "src/utils/phoneUtils";
import {ProfileServ} from "src/api-service/userService";
import {commonStyled} from "src/styles/commonStyled";
import { Link } from "react-router-dom";
import MirRabEmblem from "src/components/MirRabEmblem";
import {Input3a} from "src/components/Input3";
import {toastifyUtils} from "src/utils/toastifyUtils";
import BankCard from "./BankCard";



const ProfileView = ({ profileData }: { profileData: ProfileServ }) => {
    const p = profileData


    return <ProfileFrame>

        <Space h={96}/>

        <MirRabEmblem/>

        <Space h={40}/>

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
                <PencilIc color='black' size={18}/>
            </PencilFrame></Link>
        </MainInfoContainer>

        <Space h={47}/>

        <Input3a title={'Телефон'} value={phoneUtils.format1(p.phone)} readOnly />

        <Space h={23}/>

        <Input3a title={'E-mail'} value={p.email} readOnly />

        <Space h={40}/>

        <CardsTitle>Карты</CardsTitle>
        
        <Space h={16}/>

        {/* todo scroll */}
        <CardsContainer>
            <CardsBox>
                <BankCard highlighted/>
                <BankCard/>
            </CardsBox>
        </CardsContainer>

        <Space h={40}/>

        <AdditionalTitle onClick={toastifyUtils.notImplementedToast}>
            Правовая информация
        </AdditionalTitle>
        <Space h={8}/>
        <AdditionalTitle onClick={toastifyUtils.notImplementedToast}>
            Правила комментирования на сайте
        </AdditionalTitle>
        <Space h={8}/>
        <AdditionalTitle onClick={toastifyUtils.notImplementedToast}>
            Пользовательское соглашение
        </AdditionalTitle>
        <Space h={8}/>
        <AdditionalTitle onClick={toastifyUtils.notImplementedToast}>
            Положение об обратботке персональных данных
        </AdditionalTitle>

        <Space h={96}/>

    </ProfileFrame>
}
export default React.memo(ProfileView)



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
const Nickname = React.memo(styled.div`
  font: 500 36px 'TT Commons';
  color: black;
`)
const Fio = React.memo(styled.div`
  font: 400 18px 'TT Commons';
  color: #424041; // Gray1
`)
const PencilFrame = React.memo(styled.div`
  width: fit-content; height: fit-content;
  margin-top: 3px; margin-right: -1px;
  ${commonStyled.center};
  align-self: flex-start;
  cursor: pointer;
`)
const Age = React.memo(styled.div`
  font: 400 12px 'TT Commons';
  color: #8B8B8B; // Gray2
`)


const CardsTitle = React.memo(styled.div`
  font: 400 18px 'TT Commons';
  color: black;
`)
const CardsContainer = React.memo(styled.div`
  display: grid;
  width: 380px; height: fit-content;
  overflow-x: visible;
`)
const CardsBox = React.memo(styled.div`
  ${commonStyled.row};
  gap: 40px;
`)


const AdditionalTitle = React.memo(styled.div`
  font: 400 14px 'TT Commons';
  color: #8B8B8B;
  cursor: pointer;
  :hover{
    text-decoration-line: underline;
  }
`)