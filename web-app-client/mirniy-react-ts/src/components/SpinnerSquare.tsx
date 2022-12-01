import React from "react";
import styled, {keyframes} from "styled-components";
import {commonStyled} from "../styles/commonStyled";



const rotation = keyframes`
  100% { transform: rotate(360deg) }
`


const SpinnerSquare = React.memo(styled.div`
  width: 60px; height: 60px;
  background: none;
  border: 12px solid transparent;
  border-image-source: linear-gradient(to right, red, mediumvioletred);
  border-image-slice: 1;
  animation: ${rotation} 1.5s linear infinite;
`)
export default SpinnerSquare





export const LoadingSpinnerSquare = () => {
    return <PageLoadingSpinnerBox>
        <SpinnerSquare/>
    </PageLoadingSpinnerBox>
}

const PageLoadingSpinnerBox = React.memo(styled.div`
  width: 100%; height: 100vh;
  ${commonStyled.center};
`)