import {toast, ToastOptions} from "react-toastify";


const options: ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    //progress: undefined,
}

const notImplementedToast = () => {
    toast.info('Эта функция ещё не риализована', options)
}
const errorToast = (msg: string|undefined) => {
    toast.error(msg, options)
}



export const toastifyUtils = {
    options,
    notImplementedToast,
    errorToast,
}


