import styled from "styled-components";
import React, {useRef} from "react";
import {commonStyled} from "src/styles/commonStyled";
import { ArticleImage } from "src/api-service/articleServiceUtils";
import DashedBorder from "src/components/DashedBorder";



type TitleImage2Props = React.HTMLAttributes<HTMLDivElement> & {
    articleImage?: ArticleImage|undefined
    setTitleImage?: (articleImage: ArticleImage)=>void
    onFile?: (file:File)=>Promise<ArticleImage|undefined>
}

const TitleImage2 = (
    { articleImage, setTitleImage, onFile }: TitleImage2Props
) => {
    const aIm = articleImage?.props.isDeleted ? undefined : articleImage

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onClick = () => fileInputRef.current?.click()

    const onFileInput = async (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = (ev.currentTarget.files??[])[0]
        if (file && onFile){
            const aIm = await onFile(file)
            if (aIm && setTitleImage) setTitleImage(aIm)
        }
    }

    return <Frame onClick={onClick}>
        <DashedBorder borderRadius={4} borderColor={'#1F8DCD'} borderWidth={2} strokeDasharray='8,8' /*cornerSize={8}*//>
        { !aIm
            ? <Label>Нажмите и выберите изображение</Label>
            : <ImageWrap articleImage={aIm}/>
        }
        <FileInput ref={fileInputRef} type='file' accept='image/*' onInput={onFileInput}/>
    </Frame>
}
export default React.memo(TitleImage2)

const Frame = React.memo(styled.div`
  width: fit-content; height: fit-content;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
`)
/*const Border = React.memo(styled.div`
  ${commonStyled.abs};
  pointer-events: none;
  border: 2px dashed #1F8DCD; // todo dash offset ???
  border-radius: 4px;
`)*/
const Label = React.memo(styled.div`
  padding: 10px 16px;
  font: 600 18px 'TT Commons';
  color: #1F8DCD;
  transform: translateY(-1px);
`)
const FileInput = React.memo(styled.input`
  display: none;
`)

const ImageWrap = React.memo(({ articleImage }: { articleImage?: ArticleImage|undefined }) => {
    return <Image imageUrl={articleImage?.image!.getUrl()}/>
})
const Image = React.memo(styled.div<{ imageUrl?: string }>`
  width: 266px; height: 228px;
  margin: 10px 16px;
  background-image: url("${p=>p.imageUrl+''}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`)