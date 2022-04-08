import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface Props {
    isLogged?: boolean;

}

function PrivateRoute({ isLogged }: Props) {

    return isLogged ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute