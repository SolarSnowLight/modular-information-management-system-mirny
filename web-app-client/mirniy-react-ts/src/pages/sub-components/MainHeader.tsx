import {useAppDispatch, useAppSelector} from "src/redux/reduxHooks";
import {userActions} from "src/redux/userReducer";
import Space from "src/components/Space";
import Header from "src/components/Header";
import React from "react";
import styled from "styled-components";




function MainHeader(){

    const d = useAppDispatch()

    const accessJwt = useAppSelector(s=>s.user.accessJwt)

    const makeLogout = () => {
        d(userActions.logout())
    }

    return <Header>
        <AccessJwtView>accessJwt: {accessJwt+''}</AccessJwtView>
        <Space w={20}/>
        <div>
            <button onClick={makeLogout}>Logout</button>
        </div>
    </Header>
}
export default React.memo(MainHeader)


const AccessJwtView = styled.div`
  font-size: 12px;
  flex-grow: 1;
  overflow-wrap: anywhere;
  overflow-y: auto;
  color: #FCFCFC; // White todo extract
  //white-space: break-spaces;
`