

import EyeIc from "./icons/EyeIc";
import {useState} from "react";
import EyeCrossedOutIc from "./icons/EyeCrossedOutIc";
import * as React from "react";
import styled, {css} from "styled-components";
import {commonStyled} from "src/common-styles/commonStyled";



export type Input2CustomProps = {
    hasError?: boolean|undefined
    frameMainStyle?: ReturnType<typeof css>|undefined
    frameMainStyle2?: ReturnType<typeof css>|undefined
    frameErrorStyle?: ReturnType<typeof css>|undefined
    frameErrorStyle2?: ReturnType<typeof css>|undefined

    titleStyle?: ReturnType<typeof css>|undefined
    titleStyle2?: ReturnType<typeof css>|undefined
    title?: string|undefined

    placeholderStyle?: ReturnType<typeof css>|undefined
    placeholderStyle2?: ReturnType<typeof css>|undefined
    placeholder?: string|undefined

    inputStyle?: ReturnType<typeof css>|undefined
    inputStyle2?: ReturnType<typeof css>|undefined
    defaultHide?: boolean|undefined

    allowHideSwitch?: boolean|undefined
    hideIcColor?: string|undefined, hideIcColor2?: string|undefined
    showIcColor?: string|undefined, showIcColor2?: string|undefined
}
export type Input2Props = JSX.IntrinsicElements['input'] /*& React.HTMLAttributes<HTMLInputElement>*/ & Input2CustomProps


const Input2 = React.forwardRef<HTMLInputElement, Input2Props>((
    {
        frameMainStyle, frameMainStyle2,
        frameErrorStyle, frameErrorStyle2,
        hasError,
        titleStyle, titleStyle2, title,
        placeholderStyle, placeholderStyle2, placeholder,
        inputStyle, inputStyle2, defaultHide,
        allowHideSwitch,
        hideIcColor, showIcColor,
        hideIcColor2, showIcColor2,
        ...props
    },
    ref
) => {
    const { value } = props
    const [hideText, setHideText] = useState(defaultHide)

    return <MainFrame hasError={hasError}
                      mainStyle={frameMainStyle} errorStyle={frameErrorStyle}
                      mainStyle2={frameMainStyle2} errorStyle2={frameErrorStyle2}
    >

        { title && <Title addStyle={titleStyle} addStyle2={titleStyle2}>{title}</Title> }

        <InputContainer>

            { placeholder && !value &&
                <PlaceholderBox>
                    <Placeholder addStyle={placeholderStyle} addStyle2={placeholderStyle2}>
                        {placeholder}
                    </Placeholder>
                </PlaceholderBox>
            }

            <Input ref={ref as any} {...props}
                   type={ hideText ? 'password' : undefined}
                   addStyle={inputStyle} addStyle2={inputStyle2}
            />

        </InputContainer>

        {/* todo control icon size */}
        { allowHideSwitch && <EyeContainer onClick={()=>setHideText(!hideText)}>
            { hideText
                ? <EyeIc color={hideIcColor2 ?? hideIcColor ?? 'black'} size={22} />
                : <EyeCrossedOutIc color={showIcColor2 ?? showIcColor ?? 'black'} size={22} />
            }
        </EyeContainer> }

    </MainFrame>
})
export default React.memo(Input2)


const MainFrame = React.memo(styled.div<{
    hasError?: boolean | undefined
    mainStyle?: ReturnType<typeof css> | undefined
    mainStyle2?: ReturnType<typeof css> | undefined
    errorStyle?: ReturnType<typeof css> | undefined
    errorStyle2?: ReturnType<typeof css> | undefined
}>`
  position: relative;
  ${commonStyled.row};
  border: 2px solid #8B8B8B;
  border-radius: 4px;

  ${p => p.mainStyle};
  ${p => p.mainStyle2};
  
  ${p => p.hasError ? css`
    border: 1px solid #EE1D23;
    ${() => p.errorStyle};
    ${() => p.errorStyle2};
  ` : undefined};
`)
const Title = React.memo(styled.div<{
    addStyle?: ReturnType<typeof css>  | undefined
    addStyle2?: ReturnType<typeof css>  | undefined
}>`
  position: absolute;
  top: -0.4em; left: 2px;
  padding: 0 6px 0 12px;
  color: #424041; // Gray // todo extract into props
  background: #FCFCFC; // todo extract into props
  pointer-events: none;
  font: 400 14px 'TT Commons';
  ${p => p.addStyle};
  ${p => p.addStyle2};
`)
const InputContainer = React.memo(styled.div`
  position: relative;
  flex-grow: 1; height: 100%;
  padding-left: 14px;
`)
const PlaceholderBox = React.memo(styled.div`
  ${commonStyled.abs};
  left: 14px;
  display: grid;
  align-content: center;
  //justify-content: center;
  pointer-events: none;
`)
const Placeholder = React.memo(styled.div<{
    addStyle?: ReturnType<typeof css> | undefined
    addStyle2?: ReturnType<typeof css> | undefined
}>`
  color: black; // todo extract into props
  background: transparent;
  font: 400 19px 'TT Commons';
  pointer-events: none;
  //padding-bottom: 0.15em;
  ${p => p.addStyle};
  ${p => p.addStyle2};
`)
const Input = React.memo(styled.input<{
    addStyle?: ReturnType<typeof css> | undefined
    addStyle2?: ReturnType<typeof css> | undefined
}>`
  ${commonStyled.allDefault};
  width: 100%; height: 100%;
  font: 400 19px 'TT Commons';
  //font-weight: 400; font-size: 19px;
  //padding-bottom: 0.15em;
  //vertical-align: super;
  //background: red;
  ${p => p.addStyle};
  ${p => p.addStyle2};
`)
const EyeContainer = React.memo(styled.div`
  aspect-ratio: 1; height: 100%;
  ${commonStyled.center};
  cursor: pointer;
`)


