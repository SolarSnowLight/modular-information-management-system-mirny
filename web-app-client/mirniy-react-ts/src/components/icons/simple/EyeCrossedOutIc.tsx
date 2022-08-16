
import {ReactComponent as SvgIcon} from "src/assets/icons/eye-crossed-out.svg"
import React from "react";
import SimpleIc, {SimpleIcProps} from "./utils/SimpleIc";



const EyeCrossedOutIc = (props: SimpleIcProps) => <SimpleIc {...props} SvgComponent={SvgIcon}/>
export default React.memo(EyeCrossedOutIc)