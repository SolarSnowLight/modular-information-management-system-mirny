import {Link, useLocation} from "react-router-dom";
import MainHeader from "./Main-components/MainHeader";


function Main(){

    const location = useLocation()
    const currLocation = location.pathname+location.search+location.hash

    return <div>
        <MainHeader/>

        <Link to={'/signup'}>
            <button>Регистрация</button>
        </Link>
        <Link to={'/login?backpath='+currLocation}>
            <button>Вход</button>
        </Link>
        <Link to={'/user-articles'}>
            <button>Статьи пользователя</button>
        </Link>
        <Link to={'/create-article'}>
            <button>Создать статью</button>
        </Link>
        <Link to={'/create-article-2'}>
            <button>Создать статью 2</button>
        </Link>
    </div>
}

export default Main

