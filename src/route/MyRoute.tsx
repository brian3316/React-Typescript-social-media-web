import React, { useContext, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AllUser from '../Components/FriendSuggestion/AllUser'
import Login from '../Components/Login'
import Messenger from '../Components/Chat/Messenger'
import Home from '../Components/Home'
import MyContext from '../context/MyContext'
import PrivateRoute from './PrivateRoute'
import SearchPage from '../Components/Search/SearchPage'

const MyRoute = () => {
    const { state: AuthState, searchstate } = useContext(MyContext);


    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path='*' element={<Navigate to={"/"} />} />
            <Route element={<PrivateRoute isLogged={AuthState.isLoggedIn} />} >
                <Route path='/alluser' element={<AllUser />} />
                <Route path='/messenger' element={<Messenger myname={AuthState.userInfo.name} />} />
                <Route element={(searchstate.value.trim().length > 0 || sessionStorage.getItem("searchvalue") ? <Outlet /> : <Navigate to={"/"} />)} >
                    <Route path="/searchpage/:sevalue" element={<SearchPage />} />
                </Route>

            </Route>

        </Routes>
    )
}

export default MyRoute