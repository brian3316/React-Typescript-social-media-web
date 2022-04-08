import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Outlet } from 'react-router-dom';
import MyNavBar from '../Components/Navbar/MyNavBar';
import MyRoute from '../route/MyRoute';
import Home from '../Components/Home';
import MyContext, { dataInit as authStateInit, Authreducer, searchvalueInit, Searchreducer } from './MyContext'


function AppContext() {
    const [authState, setAuthState] = useReducer(Authreducer, authStateInit);

    const [searchState, setSearState] = useReducer(Searchreducer, searchvalueInit);

    const { state } = useContext(MyContext);

    useEffect(() => {

        const validateUser = async (token: string) => {
            try {
                await axios.get('http://localhost:3300/api/test1/validate', {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }).then((res) => {
                    // console.log("24", res);
                    setAuthState({ type: "LOGIN", data: res.data.userinfo, isloggin: res.data.userinfo.isloggin ? true : false });
                    // setAuthState({ type: "LOGIN" })
                });
            } catch (error) {
                console.log(error);
                setAuthState({ type: "LOGOUT", data: [] });

            }
        };

        if (sessionStorage.getItem('token')) {
            validateUser(sessionStorage.getItem('token') || '');


        } else {
            setAuthState({ type: "LOGOUT", data: [] });
        }

    }, []);

    return (
        <MyContext.Provider value={{ state: authState, searchstate: searchState, setState: setAuthState, setSearchState: setSearState }}>
            <MyNavBar />
            <MyRoute />
        </MyContext.Provider>
    )
}

export default AppContext