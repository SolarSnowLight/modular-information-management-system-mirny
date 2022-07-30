import React, {useEffect, useState} from "react";
import {ProfileServ, userService} from "src/api-service/userService";
import {useAppSelector} from "src/redux/reduxHooks";
import {ErrorType} from "src/models/errors";


const Profile = () => {

    const { accessJwt } = useAppSelector(s=>s.user)

    const [profileData, setProfileData] = useState(undefined as ProfileServ|undefined)
    const [error, setError] = useState(undefined as ErrorType|undefined)
    useEffect(()=>{
        if (accessJwt){
            ;(async()=>{
                const data = await userService.getProfile()
                if (data.error){
                    setError(data.error)
                    return
                }
                setProfileData(data.data)
            })()
        }
    },[accessJwt])


    return <div>{JSON.stringify(profileData)}</div>
}
export default React.memo(Profile)