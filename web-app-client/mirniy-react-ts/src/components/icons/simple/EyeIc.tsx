
import {ReactComponent as SvgIcon} from "src/assets/icons/eye.svg"
import React from "react";
import SimpleIc, {SimpleIcProps} from "./utils/SimpleIc";


const EyeIc = (props: SimpleIcProps) => <SimpleIc {...props} SvgComponent={SvgIcon} />
export default React.memo(EyeIc)


