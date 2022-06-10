import Axios, {AxiosResponse} from "axios"

//const ip = 'localhost'
const ip = '62.113.105.170'
//const port = '8000'
const port = '80'
const basePath = ""
const baseUrl = `http://${ip}:${port}/${basePath}`

const ax = Axios.create({
    baseURL: baseUrl,
    withCredentials: false
})


const makeError = () => {
    return ax.get("")
}


export const testApi = {
    makeError
}