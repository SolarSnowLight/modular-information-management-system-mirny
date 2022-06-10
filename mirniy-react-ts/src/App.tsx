import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    return <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='*' element={<Main/>}/>
    </Routes>
}

export default App;
