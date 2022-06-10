import {Link} from "react-router-dom";


function Main(){

    return <>
        <Link to={'/signup'}>
            <button>Регистрация</button>
        </Link>
        <Link to={'/login'}>
            <button>Вход</button>
        </Link>

    </>
}

export default Main