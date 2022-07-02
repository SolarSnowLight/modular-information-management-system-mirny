import styled from "styled-components";
import common from 'src/common-styles/common.module.scss'


function Header({ children }: { children: React.ReactNode}){
    return <HeaderFrame>
        <HeaderContent className={common.row}>
            { children }
        </HeaderContent>
    </HeaderFrame>
}
export default Header


const height = '82px'
const HeaderFrame = styled.div`
  width: 100%; height: ${height};
`
const HeaderContent = styled.div`
  position: fixed;
  width: 100%; height: ${height};
  background: #424041; // Gray1 todo extract
  justify-content: flex-end;
`