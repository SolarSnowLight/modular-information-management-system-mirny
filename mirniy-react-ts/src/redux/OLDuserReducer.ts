



type UserState = {
    jwt: string|null|undefined
    user: {
        name: string
    }|null|undefined
}


const initState: UserState = {
    jwt: undefined,
    user: undefined,
}



const userReducer = (state = initState, action) => {
    switch (action.type){

        default: return state
    }
}
export default userReducer




const setJwt = () => ({

})
const setUser = () => ({

})



export const user = {
    setJwt,
    setUser,
}