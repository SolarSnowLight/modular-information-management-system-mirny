import Space from "./Space";
import React from "react";
import styled from "styled-components";
import {commonStyled} from "src/styles/commonStyled";
import mirRabLogo from 'src/assets/icons/mir-rab-logo.svg'


const MirRabEmblem = () => {
    return <MirRab>
        <MirRabLogo/>
        <Space w={16}/>
        <MirRabTitle>МИРНИНСКИЙ<br/>РАБОЧИЙ</MirRabTitle>
    </MirRab>
}
export default React.memo(MirRabEmblem)


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
  color: black;
`)