import {Link, useLocation} from "react-router-dom";
import MainHeader from "./sub-components/MainHeader";
import React from "react";
import {useAppSelector} from "src/redux/reduxHooks";


function Main(){

    const location = useLocation()
    const currLocation = location.pathname+location.search+location.hash

    const { accessJwt } = useAppSelector(s=>s.user)

    /*;(async()=>{
        console.log('test image no-cors',await (await fetch("http://localhost:5000/public/ca74bf3e-6cd5-44e4-b3e7-940588f46ff8", { mode: 'no-cors' })).blob())
        console.log('test image',await (await fetch("http://localhost:5000/public/ca74bf3e-6cd5-44e4-b3e7-940588f46ff8")).blob())
    })()*/

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

