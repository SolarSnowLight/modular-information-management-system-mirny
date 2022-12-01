

import {useId, useImperativeHandle, useMemo, useRef, useState} from "react";
import * as React from "react";
import styled, { css } from "styled-components";
import {commonStyled} from "src/styles/commonStyled";
import EyeIc from "./icons/simple/EyeIc";
import EyeCrossedOutIc from "./icons/simple/EyeCrossedOutIc";
import {SimpleIcProps} from "./icons/simple/utils/SimpleIc";
import {empty} from "@rrainpath/ts-utils";



export type Input3CustomProps = {
    styled?: ReturnType<typeof css> | undefined

    title?: string|undefined
    placeholder?: string|undefined

    hasError?: boolean|undefined
    enableHideSwitch?: boolean|undefined

    hideIcStyle?: SimpleIcProps|undefined
}
export type Input3Props = JSX.IntrinsicElements['input'] & Input3CustomProps /*& React.HTMLAttributes<HTMLInputElement>*/


const Input3 = React.forwardRef<HTMLInputElement, Input3Props>((
    {
        title,
        placeholder,
        hasError,
        enableHideSwitch,
        hideIcStyle,
        ...props
    },
    forwardedRef
) => {

    const ref = useRef<HTMLInputElement>(null)
    useImperativeHandle(forwardedRef, ()=>ref.current!, [])

    const id = useId()
    const { value } = props
    const { className, type/*, onInput*/, styled, ...restProps } = props

    const [type2, setType2] = useState(type)
    const changeType = () => {
        const defaultType = type==='password' ? undefined : type
        setType2(type2==='password' ? defaultType : 'password')
    }

    /*const onCustomClick = () => {
        console.log('custom click')
        // @ts-ignore
        if (ref.current) {
            console.log('custom click 2')
            ref.current.focus()
            ref.current.selectionStart = 0
            ref.current.selectionEnd = 1
        }
    }*/

    /*const onMainInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (maskRef.current){
            const v = ev.currentTarget.value
            maskRef.current.value = '*'.repeat(v.length)
        }
        if (onInput) onInput(ev)
    }*/
    /*const maskRef = useRef<HTMLInputElement>(null)
    const onMaskInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        console.log('ev:',ev)
        // @ts-ignore
        console.log('data',ev.nativeEvent.data)
        console.log('selectonStart',ev.currentTarget.selectionStart)
        console.log('selectonEnd',ev.currentTarget.selectionStart)
        console.log('selectonEnd',ev.currentTarget.selectionDirection)

        // @ts-ignore
        const data = ev.nativeEvent.data as string
        const selEd = ev.currentTarget.selectionEnd

        setInputValue(ref.current, ev.currentTarget.value)

        // const r = ref as React.RefObject<HTMLInputElement>
        // console.log('r:',r)
        // if (r && r.current){
        //     //r.current.value = new StringBuilder(r.current.value).replace()
        //     r.current.value = 'new value'
        // }

    }
    const maskedValue = '*'.repeat(((value??'')+'').length)*/

    return <MainFrame id={`${id}-main-frame`}
                      className={className} styled={styled}
                      hasError={hasError}>

        { title &&
            <div id={`${id}-title-box`} /*onClick={onCustomClick}*/>
                <div>{title}</div>
            </div>
        }

        <div id={`${id}-input-frame`}>

            <div id={`${id}-input-container`}>

                { placeholder && !value &&
                    <div id={`${id}-placeholder-box`}>
                        <div>{placeholder}</div>
                    </div>
                }

                <div id={`${id}-input-box`}>
                    <input
                        ref={ref}
                        //ref={setRef}
                        /*ref={forwardedRef as any}*/
                        {...restProps}
                        type={type2} /*onInput={onMainInput}*/ />
                </div>

                {/*{ type2==='password' && <div id={`${id}-mask-box`}>
                    <input onInput={onMaskInput} ref={maskRef}
                           value={maskedValue}
                           //onInputCapture={onMaskInputCapture}
                    />
                </div> }*/}

            </div>

            { enableHideSwitch &&
                <div id={`${id}-hide-ic-box`} onClick={()=>changeType()}>
                    { type2==='password'
                        ? <EyeIc mainColor='#8B8B8B' size={22} {...hideIcStyle} />
                        : <EyeCrossedOutIc mainColor='#8B8B8B' size={22} {...hideIcStyle} />
                    }
                </div>
            }

        </div>

    </MainFrame>
})
export default React.memo(Input3)


type MainFrameProps = {
    hasError?: boolean | undefined
    styled?: ReturnType<typeof css> | undefined
}
const MainFrame = React.memo(styled.div.attrs<MainFrameProps>(p=>({
    'data-has-error': p.hasError,
}))<MainFrameProps>`
  position: relative;
  width: 380px; height: 45px;
  
  :before { // border
    ${commonStyled.abs}; content: ''; 
    border: 2px solid #8B8B8B;
    border-radius: 4px;
  }
  
  &[data-has-error=true]{ // when hasError
    :before{ // border
      border: 2px solid #EE1D23;
    }
  }
  
  [id$=title-box]{ // title box
    position: absolute;
    top: -0.3em; left: 3px;
    padding: 0 4px 0 12px;
    background: #FCFCFC;
    
    div{ // title text
      color: #424041;
      font: 400 14px 'TT Commons';
    }
  }
  
  [id$=input-frame] { // input frame
    ${commonStyled.abs};
    ${commonStyled.row};
  }

  [id$=input-container] { // input container
    position: relative;
    flex-grow: 1; height: 100%;
  }

  [id$=placeholder-box] { // placeholder box
    ${commonStyled.abs};
    left: 14px;
    display: grid;
    align-content: center;
    //justify-content: center;
    pointer-events: none;

    div { // placeholder text
      background: transparent;
      font: 400 19px 'TT Commons';
      color: #8B8B8B;
      pointer-events: none;
      //padding-bottom: 0.15em;
      //background: #00ff0077;
    }
  }

  [id$=input-box] { // input box
    ${commonStyled.abs};
    //width: 100%; height: 100%; // not working inside flex-grown element
    display: grid;
    align-content: stretch;
    justify-content: stretch;

    input { // input
      ${commonStyled.allDefault};
      //width: 100%; height: 100%;
      font: 400 19px 'TT Commons';
      padding-left: 14px;
      padding-right: 14px;
      /*&[type=password]{
        opacity: 0;
      }*/
      //font-weight: 400; font-size: 19px;
      //padding-bottom: 0.15em;
      //vertical-align: super;
      //background: #ff000077;
    }
  }

  [id$=mask-box] { // input characters mask box when input type='password'
    ${commonStyled.abs};
    display: grid;
    align-content: stretch;
    justify-content: stretch;

    input { // input characters mask
      ${commonStyled.allDefault};
      font: 400 19px 'TT Commons';
      padding-left: 14px;
      padding-right: 14px;
    }
  }

  [id$=hide-ic-box]{ // hide icon box
    aspect-ratio: 1; height: 100%;
    ${commonStyled.center};
    cursor: pointer;

    // todo icon props or make 100% width height and wrap
  }
  
  /*&:has( [id$=input-box]>input[value]) [id$=placeholder-box]{
    display: none;
  }
  
  &:has( [id$=input-box]>input[value]){
    display: none;
  }*/
  
  //&:has([id$=input-box] input[type=password]){}
  
  ${p=>p.styled};
`)



export const Input3a = React.memo(styled(Input3)/*.attrs(p=>({
    hideIcStyle: {...{ mainColor: 'black', size: 25 },...p.hideIcStyle}
}))*/`
  width: 380px; height: 45px;
  ::before{ border: 1px solid #8B8B8B; }
  &[data-has-error=true]:before{ border: 1px solid #EE1D23; }
  [id$=title-box] div{ font: 400 12px 'TT Commons'; }
  [id$=placeholder-box] div{ font: 500 16px 'TT Commons'; }
  [id$=input-box] input{ font: 500 16px 'TT Commons'; }
  ${p=>p.styled};
`)




const setInputValue = (input?: HTMLInputElement|empty, newValue: string = '') => {
    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
    if (input){
        valueSetter.call(input,newValue)
        const ev = new Event('input', { bubbles: true })
        input.dispatchEvent(ev)
    }
}
