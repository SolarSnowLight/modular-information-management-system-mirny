import Axios from "axios";

const ip = 'localhost'
const port = '8081'
const basePath = ""
export const API_URL_2 = `http://${ip}:${port}/${basePath}`

const ax2 = Axios.create({
    baseURL: API_URL_2,
    withCredentials: false
})



export default ax2
