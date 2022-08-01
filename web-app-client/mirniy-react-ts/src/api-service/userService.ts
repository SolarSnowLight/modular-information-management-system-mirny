import {AuthApi, LogoutApi, userApi, UserProfileApi} from "src/api/userApi";
import {Serv, serviceUtils} from "./utils";
import {DateTime} from "../utils/DateTime";




type AuthServ = {
    accessToken: string
}
const login = async (login: string, password: string): Serv<AuthServ> => {
    try {
        let { status, data } = await userApi.login(login,password)

        if (status===200) {
            data = data as AuthApi
            return serviceUtils.buildData<AuthServ>({
                accessToken: data.access_token
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




type LogoutServ = {
    isLogout: boolean
}
const logout = async (): Serv<LogoutServ> => {
    try {
        let { status, data } = await userApi.logout()

        if (status===200) {
            data = data as LogoutApi
            return serviceUtils.buildData<LogoutServ>({
                isLogout: data.is_logout
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




export type UserRegisterServ = {
    email: string
    password: string
    name: string
    surname: string
    patronymic: string
    nickname: string
    sex: boolean
    phone: string
    birthDate: string
}
const signup = async (userData: UserRegisterServ): Serv<AuthServ> => {
    try {
        let { status, data } = await userApi.signup({
            email: userData.email,
            password: userData.password,
            data: {
                name: userData.name,
                surname: userData.surname,
                patronymic: userData.patronymic,
                date_birth: userData.birthDate,
                phone: userData.phone,
                gender: userData.sex,
                nickname: userData.nickname,
            }
        })

        if (status===200) {
            data = data as AuthApi
            return serviceUtils.buildData<AuthServ>({
                accessToken: data.access_token
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




export type ProfileServ = {
    name: string
    surname: string
    patronymic: string
    sex: boolean
    phone: string
    nickname: string
    birthDate: DateTime
}
const getProfile = async (): Serv<ProfileServ> => {
    try {
        let { status, data } = await userApi.getProfile()

        if (status===200) {
            data = data as UserProfileApi
            return serviceUtils.buildData<ProfileServ>({
                name: data.name,
                surname: data.surname,
                patronymic: data.patronymic,
                sex: data.gender,
                phone: data.phone,
                nickname: data.nickname,
                birthDate: DateTime.from_dd_MM_yyyy(data.date_birth)!,
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




const updateProfile = async (profileData: ProfileServ): Serv<ProfileServ> => {
    try {
        let { status, data } = await userApi.updateProfile({
            name: profileData.name,
            surname: profileData.surname,
            patronymic: profileData.patronymic,
            gender: profileData.sex,
            phone: profileData.phone,
            nickname: profileData.nickname,
            date_birth: profileData.birthDate.to_dd_MM_yyyy(),
        })

        if (status===200) {
            data = data as UserProfileApi
            return serviceUtils.buildData<ProfileServ>({
                name: data.name,
                surname: data.surname,
                patronymic: data.patronymic,
                sex: data.gender,
                phone: data.phone,
                nickname: data.nickname,
                birthDate: DateTime.from_dd_MM_yyyy(data.date_birth)!,
            })
        }

        return serviceUtils.defaultError()
    } catch (e: any){
        return serviceUtils.generalError(e)
    }
}




export const userService = {
    login,
    logout,
    signup,
    getProfile,
    updateProfile,
}