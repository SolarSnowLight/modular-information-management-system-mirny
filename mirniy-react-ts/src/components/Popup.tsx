import styled from "styled-components";
import CrossIc from "./icons/CrossIc";


const Popup = ({ children, onClose }: { children: React.ReactNode, onClose: ()=>void }) => {
    return <PopupFrame>
        <CloseFrame onClick={onClose}><CrossIc color='black'/></CloseFrame>
        <PreviewContent>
            { children }
        </PreviewContent>
    </PopupFrame>
}
export default Popup


const PopupFrame = styled.div`
  position: fixed;
  top: 0; right: 0; min-height: 100vh; left: 0;
  overflow-y: scroll;
  background: #00000050;
  padding: 50px;
  z-index: 1000;
`
const CloseFrame = styled.div`
  position: absolute;
  width: 40px; height: 40px;
  top: 50px; right: 40px;
  cursor: pointer;
`
const PreviewContent = styled.div`
  width: fit-content; height: fit-content;
  margin: 0 auto;
`