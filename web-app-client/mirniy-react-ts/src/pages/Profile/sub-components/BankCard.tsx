import styled from "styled-components";
import React from "react";
import {commonStyled} from "src/styles/commonStyled";
import Space from "src/components/Space";


type BankCardProps = {
    highlighted?: boolean
}

const BankCard = ({ highlighted = false }: BankCardProps) => {
    return <CardBox data-highlighted={highlighted}>

        <VisaTitle>VISA</VisaTitle>

        <Space h={21.65}/>

        <SpaceBetweenBox>
            <CardNumber>••••</CardNumber>
            <CardNumber>••••</CardNumber>
            <CardNumber>••••</CardNumber>
            <CardNumber>••••</CardNumber>
        </SpaceBetweenBox>

        <Space flexGrow={1}/>

        <SpaceBetweenBox>
            <ValidThruTitle>Срок действия</ValidThruTitle>
            <ValidThruValue>••/••</ValidThruValue>
        </SpaceBetweenBox>

    </CardBox>
}
export default React.memo(BankCard)


const CardBox = React.memo(styled.div.attrs(p=>({
    'data-highlighted': p['data-highlighted'],
}))`
  width: 247px; height: 152px;
  ${commonStyled.col};
  padding: 22.85px 16px;
  border-width: 0;
  border-radius: 8px;
  background: #BCDDF0; // Primary 3
  opacity: 0.5;
  
  &[data-highlighted=true]{
    box-shadow: 0px 2px 4px rgba(5, 64, 99, 0.25);
    opacity: 1;
  }
`)

const VisaTitle = React.memo(styled.div`
  font: 600 18px 'TT Commons';
  color: #0E0E0E;
`)

const SpaceBetweenBox = React.memo(styled.div`
  width: 100%; height: fit-content;
  ${commonStyled.row};
  justify-content: space-between;
`)
const CardNumber = React.memo(styled.div`
  font: 400 14px 'TT Commons';
  color: #0E0E0E;
`)
const ValidThruTitle = React.memo(styled.div`
  font: 400 12px 'TT Commons';
  color: #424041;
  align-self: flex-end;
`)
const ValidThruValue = React.memo(styled.div`
  font: 500 16px 'TT Commons';
  color: #0E0E0E;
`)

