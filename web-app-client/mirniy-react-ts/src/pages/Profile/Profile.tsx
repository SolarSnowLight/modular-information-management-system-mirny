import React, {useEffect, useState} from "react"
import {ProfileServ, userService} from "src/api-service/userService"
import {useAppSelector} from "src/redux/reduxHooks"
import styled from "styled-components"
import {commonStyled} from "src/styles/commonStyled"
import ProfileView from "./sub-components/ProfileView";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import ProfileEdit from "./sub-components/ProfileEdit";
import {toast} from "react-toastify";
import {toastifyUtils} from "src/utils/toastifyUtils";
import {LoadingSpinnerSquare} from "src/components/SpinnerSquare";



const Profile = () => {

    const { accessJwt } = useAppSelector(s=>s.user)
    const nav = useNavigate()

    const location = useLocation()
    const currLocation = location.pathname+location.search+location.hash

    const [profileData, setProfileData] = useState(undefined as ProfileServ|undefined)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        if (!accessJwt) {
            toast.info('Вам нужно войти на сайт чтобы посмотреть свой профиль', toastifyUtils.options)
            nav('/login?backpath='+currLocation)
        }
        if (loading) return; setLoading(true); let didCancel = false
        ;(async()=>{
            try {
                const data = await userService.getProfile()
                if (didCancel) return
                if (data.type==='error'){
                    toastifyUtils.errorToast(data.error.message)
                    return
                }
                setProfileData(data.data)
            } finally { setLoading(false) }
        })()
        return ()=>{didCancel=true}
    },[accessJwt])


    return <Page>
        { loading && <LoadingSpinnerSquare/> }
        { profileData && <Routes>
            <Route path='' element={<ProfileView profileData={profileData}/>} />
            <Route path='edit' element={<ProfileEdit profileData={profileData} setProfileData={setProfileData}/>} />
        </Routes> }
        {/*<>{JSON.stringify(profileData)}</>*/}
    </Page>
}
export default React.memo(Profile)


const Page = React.memo(styled.div`
  min-width: 100%; min-height: 100vh;
  background: #FCFCFC;
  ${commonStyled.center};
`)
