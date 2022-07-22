import {trimSlash} from "../utils/utils";


const ip = 'localhost'
const port = '5000'
const basePath = ""
export const FILE_API_URL = trimSlash(`http://${ip}:${port}/${basePath}`)



function fileNameFromRemotePath(remotePath: string){
    // todo
}