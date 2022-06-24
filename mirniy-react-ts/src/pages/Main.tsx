import {Link} from "react-router-dom";
import {testApi} from "../api/testApi";
import Axios, {AxiosError} from "axios";


function Main(){

    /*const makeError = () => {
        testApi.makeError().then(
            response => console.log('response', response),
            (error: AxiosError) => {
                console.log('isAxiosError:', Axios.isAxiosError(error))
                console.log('error', error)
                console.log('error code: ', error.code)
            }
        )
    }*/

    return <>
        <Link to={'/signup'}>
            <button>Регистрация</button>
        </Link>
        <Link to={'/login'}>
            <button>Вход & Выход</button>
        </Link>
        <Link to={'/login2'}>
            <button>Вход</button>
        </Link>
        <Link to={'/article'}>
            <button>Статья</button>
        </Link>

        {/*<button onClick={makeError}>Error</button>*/}
    </>
}

export default Main

