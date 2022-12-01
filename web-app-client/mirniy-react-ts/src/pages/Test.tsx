import EyeIc from "src/components/icons/simple/EyeIc";
import Input3, {Input3a} from "src/components/Input3";
import styled, {css} from "styled-components";
import {useId} from "react";
import Space from "../components/Space";


const Test = () => {
    const id = useId()

    const customAttrs = {
        'data-has-error': 'yes',
        'has-error': 'yes',
        hasError: 'yes',
    }

    return <div style={{padding: 16}}>
        <EyeIc mainColor={'aquamarine'} size={50}/>

        <Space h={16}/>

        <Input3a
            hasError={false}
            enableHideSwitch
            /*type='password'*/
            title='Title'
            placeholder='Placeholder'
        />

        <Space h={16}/>

        <Input3b
            hasError={true}
            enableHideSwitch
            /*type='password'*/
            title='Title'
            hideIcStyle={{mainColor:'red', size: undefined}}
        />

        <Space h={16}/>

        <Div hasError>
            <div id={`${id}-asdfg`} {...customAttrs}></div>
        </Div>

        <Space h={16}/>

    </div>
}
export default Test


const Input3b = styled(Input3).attrs(p=>({
    hideIcStyle: {...{ mainColor: 'black', size: 25 },...p.hideIcStyle}
}))`
  
`


const Div = styled.div.attrs<{ hasError: boolean }>(p=>({
    'data-has-error': 'no',
    // @ts-ignore
    'data-hasError': p.hasError,
}))<{ hasError: boolean }>`
  width: 200px; height: 200px;
  background: red;
  
  
  
  [id$=-asdfg]{
    width: 100px; height: 100px;
    background: green;

    &[haserror=yes] {
      background: blueviolet;
    }
  }
  
  &[data-has-error=no] {
    background: blueviolet;
  }
  
  &[data-hasError] {
    background: aquamarine;
  }
  
`