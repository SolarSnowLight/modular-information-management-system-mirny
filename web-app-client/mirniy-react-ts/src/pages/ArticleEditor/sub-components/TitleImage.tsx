import styled from "styled-components";
import React from "react";
import {abs, absoluteOff} from "src/styles/commonStyled";
import {ArticleImage} from "src/api-service/articleServiceUtils";



type Props = React.HTMLAttributes<HTMLDivElement> & {
    articleImage?: ArticleImage|undefined
}

const TitleImage = React.memo(React.forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        const { articleImage, ...restProps } = props
        return <Frame ref={ref} {...restProps}>
            <Border/>
            <ImageWrap articleImage={articleImage}/>
        </Frame>
}))
export default React.memo(TitleImage)

const Frame = styled.div`
  position: relative;
  width: 360px; height: 300px;
  cursor: pointer;
`
const Border = React.memo(styled.div`
  ${abs};
  pointer-events: none;
  border: 2px dashed #1F8DCD;
  border-radius: 4px;

  ${Frame}:focus && {
    border: 4px solid #1F8DCD;
  }
`)
const ImageWrap = React.memo(({ articleImage }: { articleImage?: ArticleImage|undefined }) => {
    return <Image imageUrl={articleImage?.image?.getUrl()}/>
})
const Image = React.memo(styled.div<{ imageUrl?: string }>`
  ${absoluteOff('14px 21px')};
  background-image: url("${p=>p.imageUrl+''}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`)