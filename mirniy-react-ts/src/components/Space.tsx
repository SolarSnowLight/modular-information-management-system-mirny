import React from "react";


const Space = (
    {w,h,flexGrow}: { w?: number|string, h?: number|string, flexGrow?: number }
) => <div style={{ width: w, height: h, flexGrow: flexGrow }}/>



export default React.memo(Space)