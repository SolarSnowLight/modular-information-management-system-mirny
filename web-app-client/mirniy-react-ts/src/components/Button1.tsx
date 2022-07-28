
//import css from './Button1.module.scss'
//import React from "react";
import styled from "styled-components";
import {allDefault} from "src/common-styles/commonStyled";
import React from "react";

/*
type Button1Props = React.HTMLAttributes<HTMLButtonElement> & {
    w?: string|number
    h?: string|number
}
const Button1 = React.memo(React.forwardRef<HTMLButtonElement, Button1Props>(
(
        { w = '100%', h = '100%', ...props },
     ref
) => {
    const { children, style, ...restProps } = props
    return <button className={css.btn} ref={ref}
        style={{
           ...style,
           width: w, height: h,
        }}
        {...restProps}
    >
        { children }
    </button>
}))*/

const Button1 = styled.button`
  ${allDefault};
  
  background: #1F8DCD; // Blue todo extract color
  border-radius: 4px;

  color: white; // White todo extract color
  font: 600 22px 'TT Commons';
  padding-bottom: 0.15em;
  text-align: center;

  cursor: pointer;
`

export default React.memo(Button1)