
import css from './Input1.module.scss'
import EyeIc from "./icons/EyeIc";
import {FormEventHandler, useState} from "react";
import EyeCrossedOutIc from "./icons/EyeCrossedOutIc";


type Input1Props = {
    w?: string|number
    h?: string|number
    title?: string
    placeholder?: string
    autofocused?: boolean
    hasError?: boolean
    hide?: boolean
    hideable?: boolean
    value?: string
    onInput?: FormEventHandler<HTMLInputElement>

    titleFont?: string
    titleColor?: string
    placeholderFont?: string
    placeholderColor?: string
    textFont?: string
    textColor?: string
    borderColor?: string
}

const Input1 = ({
        w = '100%', h = '100%', title, placeholder, autofocused, hasError,
        hideable, hide, value, onInput,
        titleFont, titleColor, placeholderFont, placeholderColor, textFont, textColor, borderColor
}: Input1Props) => {

    const [inputFocused, setInputFocused] = useState(autofocused)
    const [hideText, setHideText] = useState(hide)

    return <div className={css.mainFrame +' '+ (hasError?css.mainFrameError:'')}
                style={{
                    width: w, height: h, borderColor: borderColor
                }}>

        { title && <div className={css.title}
                        style={{ fontFamily: titleFont, color: titleColor }}
                    >
                {title}
            </div> }


            <div className={css.inputContainer}>
                { placeholder && !inputFocused && !value &&
                    <div className={css.placeholderContainer}>
                        <div className={css.placeholder}
                             style={{ fontFamily: placeholderFont, color: placeholderColor }}
                        >
                            {placeholder}
                        </div>
                    </div>
                }
                <input autoFocus={autofocused}
                       type={ hideText ? 'password' : undefined}
                       onFocus={()=>setInputFocused(true)} onBlur={()=>setInputFocused(false)}
                       value={value} onInput={onInput}
                       style={{ fontFamily: textFont, color: textColor }}
                />
            </div>
            <div className={css.eyeContainer} onClick={()=>setHideText(!hideText)}>
                { hideable && (hideText
                    ? <EyeIc fill='black' size={22} />
                    : <EyeCrossedOutIc fill='black' size={23} />
                )}
            </div>

    </div>
}
export default Input1