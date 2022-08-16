

import {useId, useState} from "react";
import * as React from "react";
import styled, {css} from "styled-components";
import {commonStyled} from "src/common-styles/commonStyled";
import EyeIc from "./icons/simple/EyeIc";
import EyeCrossedOutIc from "./icons/simple/EyeCrossedOutIc";
import {SimpleIcProps} from "./icons/simple/utils/SimpleIc";
import Space from "./Space";



export type Input3CustomProps = {
    title?: string|undefined
    placeholder?: string|undefined

    hasError?: boolean|undefined
    allowHideSwitch?: boolean|undefined

    hideIcStyle?: SimpleIcProps|undefined, hideIcStyle2?: SimpleIcProps|undefined
}
export type Input3Props = JSX.IntrinsicElements['input'] & Input3CustomProps /*& React.HTMLAttributes<HTMLInputElement>*/


const Input3 = React.forwardRef<HTMLInputElement, Input3Props>((
    {
        title,
        placeholder,
        hasError,
        allowHideSwitch,
        hideIcStyle, hideIcStyle2,
        ...props
    },
    ref
) => {
    const id = useId()
    const { value } = props
    const { className, type, ...restProps } = props

    const [type2, setType2] = useState(type)
    const changeType = () => {
        const defaultType = type==='password' ? undefined : type
        setType2(type2==='password' ? defaultType : 'password')
    }

    const hideIcStyleFinal = {...hideIcStyle,...hideIcStyle2}

    return <MainFrame id={`${id}-main-frame`} className={className}
                      hasError={hasError}>

        { title &&
            <div id={`${id}-title-box`}><div>{title}</div></div>
        }

        <div id={`${id}-input-frame`}>

            <div id={`${id}-input-container`}>

                { placeholder && !value &&
                    <div id={`${id}-placeholder-box`}><div>{placeholder}</div></div>
                }

                <div id={`${id}-input-box`}>
                    <input ref={ref as any} {...restProps}
                           type={type2}/>
                </div>

            </div>

            { allowHideSwitch &&
                <div id={`${id}-hide-ic-box`} onClick={()=>changeType()}>
                    { type2==='password'
                        ? <EyeIc mainColor='#8B8B8B' size={22} {...hideIcStyleFinal} />
                        : <EyeCrossedOutIc mainColor='#8B8B8B' size={22} {...hideIcStyleFinal} />
                    }
                </div>
            }

        </div>

    </MainFrame>
})
export default React.memo(Input3)


type MainFrameProps = { hasError?: boolean | undefined }
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
      pointer-events: none;
    }
  }
  
  [id$=input-frame] { // input frame
    ${commonStyled.abs};
    ${commonStyled.row};

    [id$=input-container] { // input container
      position: relative;
      flex-grow: 1; height: 100%;

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
          //font-weight: 400; font-size: 19px;
          //padding-bottom: 0.15em;
          //vertical-align: super;
          //background: #ff000077;
        }
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
    }

    [id$=hide-ic-box]{ // hide icon box
      aspect-ratio: 1; height: 100%;
      ${commonStyled.center};
      cursor: pointer;
      
      // todo icon props or make 100% width height and wrap
    }
  }
  
  /*&:has( [id$=input-box]>input[value]) [id$=placeholder-box]{
    display: none;
  }
  
  &:has( [id$=input-box]>input[value]){
    display: none;
  }*/
  
  //&:has([id$=input-box] input[type=password]){}
`)



export const Input3a = React.memo(styled(Input3)`
  width: 380px; height: 45px;
  :before{ border: 1px solid #8B8B8B; }
  &[data-has-error=true]:before{ border: 1px solid #EE1D23; }
  [id$=title]{ font: 400 12px 'TT Commons'; }
  [id$=placeholder-box] div { font: 500 16px 'TT Commons'; }
`)


