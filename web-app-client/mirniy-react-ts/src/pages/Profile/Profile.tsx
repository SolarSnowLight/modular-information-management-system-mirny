import React, {useEffect, useState} from "react"
import {ProfileServ, userService} from "src/api-service/userService"
import {useAppSelector} from "src/redux/reduxHooks"
import {ErrorType} from "src/models/errors"
import styled from "styled-components"
import {commonStyled} from "src/common-styles/commonStyled"
import ProfileView from "./sub-components/ProfileView";
import {useLocation} from "react-router-dom";
import {urlUtils} from "src/utils/urlUtils";
import ProfileEdit from "./sub-components/ProfileEdit";


const Profile = () => {

    const isEdit = 'edit' === urlUtils.findLastPathSegment(useLocation().pathname)
    const { accessJwt } = useAppSelector(s=>s.user)

    const [profileData, setProfileData] = useState(undefined as ProfileServ|undefined)
    const [error, setError] = useState(undefined as ErrorType|undefined)
    useEffect(()=>{
        if (accessJwt){
            ;(async()=>{
                const data = await userService.getProfile()
                if (data.type === 'error'){
                    setError(data.error)
                    return
                }
                setProfileData(data.data)
            })()
        }
    },[accessJwt])

    return <Page>
        { profileData && !isEdit && <ProfileView profileData={profileData} /> }
        { profileData && isEdit && <ProfileEdit profileData={profileData} /> }
        {/*<>{JSON.stringify(profileData)}</>*/}
    </Page>
}
export default React.memo(Profile)


const Page = React.memo(styled.div`
  min-width: 100%; min-height: 100vh;
  background: #FCFCFC;
  ${commonStyled.center};
`)