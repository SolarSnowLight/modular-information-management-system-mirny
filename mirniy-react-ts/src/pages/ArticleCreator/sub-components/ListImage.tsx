import React, {useEffect, useState} from "react";
import CrossIc from "src/components/icons/CrossIc";
import Button1 from "src/components/Button1";
import styled from "styled-components";
import {ImageSrc} from "src/models/ImageSrc";





const ListImage = React.memo((
    { imageSource, onRemove, onPaste }
        : { imageSource: ImageSrc, onRemove: (imageSource: ImageSrc)=>void, onPaste: (imageSource: ImageSrc)=>void }
) => {

    const [fileUrl, setFileUrl] = useState(undefined as undefined|string)
    useEffect(()=>{
        let cancel = false
        ;(async () => {
            if (imageSource){
                const url = await imageSource.getUrl()
                if (!cancel) setFileUrl(url)
            }
        })()
        return ()=>{ cancel=true }
    }, [imageSource])

    /*const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.dataTransfer.setData('application/json', JSON.stringify({
            type: 'imageItem', id: id
        }))
        ev.dataTransfer.effectAllowed = 'move'
    }*/



    return <ImageItemFrame
        /*draggable onDragStart={onDragStart}*/>

        <ImageItemText>id: {imageSource.id}</ImageItemText>
        <CrossContainer onClick={()=>onRemove(imageSource)}><CrossIc color='black'/></CrossContainer>

        <Image imageUrl={fileUrl}/>

        <ButtonBox>
            <Button1 onClick={()=>onPaste(imageSource)}
                     style={{
                         background: '#1F8DCD',
                         font: "500 16px 'TT Commons'", color: '#FCFCFC',
                     }}
            >Добавить</Button1>
        </ButtonBox>

    </ImageItemFrame>

})
export default ListImage

const ImageItemFrame = React.memo(styled.div`
  display: grid;
  grid-template: auto auto / 1fr auto;
`)
const ImageItemText = React.memo(styled.div`
  font: 500 16px 'TT Commons';
  color: #424041; // Gray1
  grid-area: 1 / 1;
  //padding-top: 4px;
  align-self: center;
`)
const CrossContainer = React.memo(styled.div`
  width: 16px; height: 16px; align-self: end;
  margin: 6px;
  grid-area: 1 / 2;
  cursor: pointer;
`)
const Image = React.memo(styled.div<{ imageUrl?: string }>`
  width: 100%; aspect-ratio: 1.17 / 1;
  background-image: url("${p=>p.imageUrl}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  grid-area: 2 / 1 / span 1 / span 2;
`)
const ButtonBox = React.memo(styled.div`
  width: 91px; height: 32px;
  margin: 0 10px 10px 0;
  align-self: end; justify-self: end;
  grid-area: 2 / 1 / span 1 / span 2;
`)
