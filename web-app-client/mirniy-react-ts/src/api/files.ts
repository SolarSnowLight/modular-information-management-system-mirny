import {trimSlash} from "../utils/utils";


const ip = 'localhost'
const port = '5000'
const basePath = ""
const API_URL = trimSlash(`http://${ip}:${port}/${basePath}`)



function fileNameFromRemotePath(remotePath: string){
    return remotePath.match(/\/(?<name>[/w-]+)$/)?.groups?.name
}

export const files = {
    API_URL,
    fileNameFromRemotePath,
}