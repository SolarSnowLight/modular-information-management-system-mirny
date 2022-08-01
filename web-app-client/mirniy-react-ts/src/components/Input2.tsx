

import EyeIc from "./icons/EyeIc";
import {useState} from "react";
import EyeCrossedOutIc from "./icons/EyeCrossedOutIc";
import * as React from "react";
import styled, {css} from "styled-components";
import {commonStyled} from "src/common-styles/commonStyled";




type Input2Props = React.HTMLAttributes<HTMLInputElement> & {

    hasError?: boolean
    frameMainStyle?: ReturnType<typeof css>
    frameErrorStyle?: ReturnType<typeof css>

    titleStyle?: ReturnType<typeof css>
    title?: string

    placeholderStyle?: ReturnType<typeof css>
    placeholder?: string

    inputStyle?: ReturnType<typeof css>


    hide?: boolean
    hideable?: boolean



}

// todo React.forwardRef - use focus here
// todo password hide symbols

const Input2 = React.forwardRef<HTMLInputElement, Input2Props>((
    {
        frameMainStyle, frameErrorStyle, hasError,
        titleStyle, title,
        placeholderStyle, placeholder,
        inputStyle,

            hideable, hide,
        ...props
    },
    ref
) => {


    const { value } = props

    const inputFocused = false // todo remove

    const [hideText, setHideText] = useState(hide)

    return <MainFrame hasError={hasError} mainStyle={frameMainStyle} errorStyle={frameErrorStyle}>

        { title && <Title addStyle={titleStyle}>{title}</Title> }

        <InputContainer>

            { placeholder && !inputFocused && !value &&
                <PlaceholderBox>
                    <Placeholder addStyle={placeholderStyle}>
                        {placeholder}
                    </Placeholder>
                </PlaceholderBox>
            }

            <Input ref={ref} {...props}
                   type={ hideText ? 'password' : undefined}
                   addStyle={inputStyle}
            />

        </InputContainer>

        { hideable && <EyeContainer onClick={()=>setHideText(!hideText)}>
            { hideText
                ? <EyeIc fill='black' size={22} />
                : <EyeCrossedOutIc fill='black' size={23} />
            }
        </EyeContainer> }

    </MainFrame>
})
export default Input2


const MainFrame = styled.div<{
    hasError?: boolean | undefined
    mainStyle?: ReturnType<typeof css> | undefined
    errorStyle?: ReturnType<typeof css> | undefined
}>`
  position: relative;
  border: 2px solid #8B8B8B;
  border-radius: 4px;

  ${p => p.mainStyle};
  
  ${p => p.hasError ? css`
    border: 1px solid #EE1D23;
    ${() => p.errorStyle};
  ` : undefined};
`
const Title = styled.div<{
    addStyle?: ReturnType<typeof css>  | undefined
}>`
  position: absolute;
  top: -0.4em; left: 2px;
  padding: 0 6px 0 12px;
  color: #424041; // Gray // todo extract into props
  background: #FCFCFC; // todo extract into props
  pointer-events: none;
  font: 400 14px 'TT Commons';
  ${p => p.addStyle};
`
const InputContainer = styled.div`
  position: relative;
  flex-grow: 1; height: 100%;
  padding-left: 14px;
`
const PlaceholderBox = styled.div`
  ${commonStyled.abs};
  left: 14px;
  display: grid;
  align-content: center;
  //justify-content: center;
  pointer-events: none;
`
const Placeholder = styled.div<{
    addStyle?: ReturnType<typeof css>  | undefined
}>`
  color: black; // todo extract into props
  background: transparent;
  font: 400 19px 'TT Commons';
  pointer-events: none;
  padding-bottom: 0.15em;
  ${p => p.addStyle};
`
const Input = styled.input<{
    addStyle?: ReturnType<typeof css>  | undefined
}>`
  ${commonStyled.allDefault};
  width: 100%; height: 100%;
  font: 400 19px 'TT Commons';
  //font-weight: 400; font-size: 19px;
  padding-bottom: 0.15em;
  //vertical-align: super;
  //background: red;
  ${p => p.addStyle};
`
const EyeContainer = styled.div`
  aspect-ratio: 1; height: 100%;
  ${commonStyled.center};
  cursor: pointer;
`


