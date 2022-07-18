import styled from "styled-components";
import CrossIc from "./icons/CrossIc";


const Popup = ({ children, onClose }: { children: React.ReactNode, onClose: ()=>void }) => {
    const stopEvent = (ev: React.MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
    }
    return <PopupFrame onClick={onClose}>
        <CloseFrame onClick={onClose}><CrossIc color='black'/></CloseFrame>
        <PreviewContent onClick={stopEvent}>
            { children }
        </PreviewContent>
    </PopupFrame>
}
export default Popup


const PopupFrame = styled.div`
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  overflow: auto;
  background: #00000050;
  padding: 50px;
  z-index: 1000;
  cursor: pointer;
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
  cursor: auto;
`