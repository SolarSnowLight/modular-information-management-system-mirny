import React, {useLayoutEffect, useState} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ArticleOLD from "./pages/ArticleOLD";
import {useAppDispatch} from "./redux/hooks";
import {appActions} from "./redux/appReducer";
import {useDebounce} from "./hooks/useDebounce";
import ArticleNew from "./pages/ArticleNew";
import ArticlePreview from "./pages/ArticlePreview";
import Login2 from "./pages/Login2";

function App() {

    const d = useAppDispatch()


    const onDragEnter = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        ev.stopPropagation()
        //d(appActions.setDragging(true))
        //d(appActions.setDraggingFiles(true))
/*

        d(appActions.setDragging())
        for(let item of ev.dataTransfer.items){
            if (item.kind==='file') {
                d(appActions.setDraggingFiles())
                break
            }
        }

*/
        // use kind: 'file'
        console.log('ENTER:', ev)

    }

    const [dragging, setDragging] = useState({})
    useDebounce(()=>{
        d(appActions.setDragging(false))
        d(appActions.setDraggingFiles(false))
    }, 150, [dragging])

    const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        ev.stopPropagation()


        d(appActions.setDragging())
        for(let item of ev.dataTransfer.items){
            if (item.kind==='file') {
                d(appActions.setDraggingFiles())
                break
            }
        }
        setDragging({})

        //console.log('OVER:', ev)
    }
    const onDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        ev.stopPropagation()
        //d(appActions.setDragging(false))
        //d(appActions.setDraggingFiles(false))
        console.log('LEAVE:', ev)
    }
    const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault()
        ev.stopPropagation()
        d(appActions.setDragging(false))
        d(appActions.setDraggingFiles(false))
    }


    /*const [showOverlay, setShowOverlay] = useState(false)
    const [first, setFirst] = useState(false)
    const [second, setSecond] = useState(false)*/
    //if (!first) setTimeout(()=>{setShowOverlay(true); setFirst(true)}, 5000)
    //if (!second) setTimeout(()=>{setShowOverlay(false); setSecond(true)}, 10000)


    return <>
        <div style={{ display: 'contents' }}
                    onDragEnter={onDragEnter} onDragLeave={onDragLeave}
                    onDragOver={onDragOver} onDrop={onDrop}>
            <Routes>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/login2' element={<Login2/>}/>
                <Route path='/article' element={<ArticleNew/>}/>

                <Route path='*' element={<Main/>}/>
            </Routes>

            {/*{ showOverlay && <div style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100vh', background: 'yellow' }}>

            </div> }*/}

        </div>
    </>
}

export default App;
