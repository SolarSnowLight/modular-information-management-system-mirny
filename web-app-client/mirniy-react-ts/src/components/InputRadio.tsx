import React from "react"
import styled, {css} from "styled-components"
import {commonStyled} from "src/common-styles/commonStyled";
import RadioActiveIc from "./icons/RadioActiveIc";
import RadioInactiveIc from "./icons/RadioInactiveIc";


export type InputRadioCustomProps = {
    frameStyle?: ReturnType<typeof css> | undefined
    frameStyle2?: ReturnType<typeof css> | undefined
    activeIcColor?: string|undefined
    inactiveIcColor?: string|undefined
}
export type InputRadioProps = JSX.IntrinsicElements['input'] /*& React.HTMLAttributes<HTMLInputElement>*/ & InputRadioCustomProps

const InputRadio = React.forwardRef<HTMLInputElement, InputRadioProps>((
    {
        frameStyle, frameStyle2,
        activeIcColor = '#1F8DCD', inactiveIcColor = 'black',
        ...props
    },
    ref
) => {

    return <Frame addStyle={frameStyle} addStyle2={frameStyle2}>

        <Input ref={ref as any} {...props} type='radio'/>

        <ActiveIcWrap><RadioActiveIc color={activeIcColor} size={'100%'}/></ActiveIcWrap>
        <InactiveIcWrap><RadioInactiveIc color={inactiveIcColor} size={'100%'}/></InactiveIcWrap>

    </Frame>
})
export default React.memo(InputRadio)


const Frame = React.memo(styled.div<{
    addStyle?: ReturnType<typeof css>  | undefined
    addStyle2?: ReturnType<typeof css>  | undefined
}>`
  ${commonStyled.row};
  position: relative;
  ${p => p.addStyle};
  ${p => p.addStyle2};
`)
const Input = React.memo(styled.input`
  //display: none;
  ${commonStyled.abs};
  opacity: 0;
  width: 100%; height: 100%;
  cursor: pointer;
`)
const ActiveIcWrap = React.memo(styled.div`
  display: none;
  width: 100%; height: 100%;
  input:checked ~ && {
    display: block;
  }
`)
const InactiveIcWrap = React.memo(styled.div`
  display: block;
  width: 100%; height: 100%;
  input:checked ~ && {
    display: none;
  }
`)
