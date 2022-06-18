import {Link} from "react-router-dom";
import {testApi} from "../api/testApi";
import {AxiosError} from "axios";


function Main(){

    /*const makeError = () => {
        testApi.makeError().then(
            response => console.log('response', response),
            (error: AxiosError) => {
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
        {/*<button onClick={makeError}>Error</button>*/}
        <Link to={'/article'}>
            <button>Статья</button>
        </Link>
        <Link to={'/article-new'}>
            <button>Статья New</button>
        </Link>
    </>
}

export default Main