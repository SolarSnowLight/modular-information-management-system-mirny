import CrossIc from "src/components/icons/CrossIc";
import Button1 from "src/components/Button1";
import styled from "styled-components";
import React from "react";
import {commonStyled} from "src/styles/commonStyled";
import {ArticleImage} from "src/api-service/articleServiceUtils";



type ListImageProps = {
    articleImage: ArticleImage
    onRemove: (articleImage: ArticleImage)=>void
    onPaste: (articleImage: ArticleImage)=>void
    onTitleImagePaste: (articleImage: ArticleImage)=>void
    onTextImagePaste: (articleImage: ArticleImage)=>void
}

const ListImage = React.memo((
    { articleImage, onRemove, onPaste, onTitleImagePaste, onTextImagePaste } : ListImageProps
) => {

    /*const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.dataTransfer.setData('application/json', JSON.stringify({
            type: 'imageItem', id: id
        }))
        ev.dataTransfer.effectAllowed = 'move'
    }*/

    const enableTitle = articleImage.props.isNew || articleImage.props.isTitle
    const enableText = articleImage.props.isNew || articleImage.props.hasServerLocalId

    return <ImageItemFrame
        /*draggable onDragStart={onDragStart}*/>

        <ImageItemText>id: {articleImage.localId}</ImageItemText>
        <CrossContainer onClick={()=>onRemove(articleImage)}><CrossIc color='black'/></CrossContainer>

        <Image imageUrl={articleImage.image!.getUrl()}/>

        <ButtonBox>
            <AddButton onClick={()=>onTitleImagePaste(articleImage)} disabled={!enableTitle}>Заголовок</AddButton>
            <AddButton onClick={()=>onTextImagePaste(articleImage)} disabled={!enableText}>Текст</AddButton>
        </ButtonBox>

    </ImageItemFrame>

})
export default React.memo(ListImage)

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
  ${commonStyled.row};
  gap: 7px;
  margin-right: 7px; margin-bottom: 3px;
  align-self: end; justify-self: end;
  grid-area: 2 / 1 / span 1 / span 2;
`)
const AddButton = styled(Button1)`
  width: 91px; height: 32px;
  background: #1F8DCD;
  font: 500 16px 'TT Commons';
  color: #FCFCFC;
  &[disabled] {
    border-color: #8B8B8B;
    background: white;
    color: #8B8B8B;
    cursor: auto;
  }
`
