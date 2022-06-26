import {Link, useLocation} from "react-router-dom";
import Header from "./Main-components/Header";


function Main(){

    const location = useLocation()
    const currLocation = location.pathname+location.search+location.hash

    return <div>
        <Header/>

        <Link to={'/signup'}>
            <button>Регистрация</button>
        </Link>
        <Link to={'/login?backpath='+currLocation}>
            <button>Вход</button>
        </Link>
        <Link to={'/article'}>
            <button>Статья</button>
        </Link>
    </div>
}

export default Main

