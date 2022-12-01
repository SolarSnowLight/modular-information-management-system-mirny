import styled from "styled-components";
import common from 'src/styles/common.module.scss'
import React from "react";


function Header({ children }: { children: React.ReactNode}){
    return <HeaderFrame>
        <HeaderContent className={common.row}>
            { children }
        </HeaderContent>
    </HeaderFrame>
}
export default React.memo(Header)


const height = '82px'
const HeaderFrame = React.memo(styled.div`
  width: 100%; height: ${height};
`)
const HeaderContent = React.memo(styled.div`
  position: fixed;
  width: 100%; height: ${height};
  background: #424041; // Gray1 todo extract
  justify-content: flex-end;
`)