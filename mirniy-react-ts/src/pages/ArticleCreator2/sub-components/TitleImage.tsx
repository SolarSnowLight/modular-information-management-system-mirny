import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {absolute, absoluteOff} from "src/common-styles/commonStyled";
import {ImageSrc} from "src/entities/ImageSrc";


// INFO:

// div props: React.HTMLAttributes<HTMLDivElement>
// div props with ref: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

// styled components && - ссылка на текущий экземпляр компоненты



type Props = React.HTMLAttributes<HTMLDivElement> & {
    imageSource?: ImageSrc
}

const TitleImage = React.memo(React.forwardRef<HTMLDivElement, Props>(
    (props, ref) => {
        const { imageSource, ...restProps } = props
        return <Frame ref={ref} {...restProps}>
            <Border/>
            <ImageWrap imageSource={imageSource}/>
        </Frame>
}))
export default TitleImage

const Frame = styled.div`
  position: relative;
  width: 360px; height: 300px;
  cursor: pointer;
`
const Border = React.memo(styled.div`
  ${absolute};
  pointer-events: none;
  border: 2px dashed #1F8DCD;
  border-radius: 4px;

  ${Frame}:focus && {
    border: 4px solid #1F8DCD;
  }
`)
const ImageWrap = React.memo(({ imageSource }: { imageSource?: ImageSrc }) => {

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

    return <Image imageUrl={fileUrl}/>
})
const Image = React.memo(styled.div<{ imageUrl?: string }>`
  ${absoluteOff('14px 21px')};
  background-image: url("${p=>p.imageUrl+''}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`)