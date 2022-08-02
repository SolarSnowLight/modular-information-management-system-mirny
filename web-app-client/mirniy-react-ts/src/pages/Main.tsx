import {Link, useLocation} from "react-router-dom";
import MainHeader from "./sub-components/MainHeader";
import React from "react";
import {useAppSelector} from "src/redux/reduxHooks";


function Main(){

    const location = useLocation()
    const currLocation = location.pathname+location.search+location.hash

    const { accessJwt } = useAppSelector(s=>s.user)

    return <div>
        <MainHeader/>

        <Link to={'/signup'}>
            <button>Регистрация</button>
        </Link>
        <Link to={'/login?backpath='+currLocation}>
            <button>Вход</button>
        </Link>
        { accessJwt && <Link to={'/user/profile'}>
            <button>Профиль</button>
        </Link>}
        <Link to={'/articles/user'}>
            <button>Статьи пользователя</button>
        </Link>
        <Link to={'/article/create'}>
            <button>Создать статью</button>
        </Link>
    </div>
}

export default React.memo(Main)

