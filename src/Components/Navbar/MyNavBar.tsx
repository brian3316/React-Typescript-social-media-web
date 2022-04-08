import faker from '@faker-js/faker'
import { Fake } from '@faker-js/faker/fake'
import axios from 'axios'
import React, { ButtonHTMLAttributes, FC, useContext, useEffect, useState } from 'react'
import { Link, Location, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import MyContext from '../../context/MyContext'
import './mynavbar.css'
import { BsSearch } from 'react-icons/bs';
import { motion } from 'framer-motion';




// console.log(process.env.REACT_APP_UNSPLASH_URL);

const LogOutButton = styled(motion.button)`
    cursor: pointer;
    border: none;
    color: darkslategray;
    font-weight: bold;
    background: #ffd19a;
    transition: all 0.25s ease-out;
    text-align: center;
    vertical-align: middle;
    padding: 12px 24px;
    margin-left: 20px;
    width: 120px;
    height: 50px;
    border-radius: 999px;
    box-shadow: -1px 0 3px 3px  whitesmoke;
    /* text-shadow: #591717 2px 5px 0px; */
    font: normal normal bold 20px arial;


  
    &:hover {
        position: relative;
        top: -3px;
        box-shadow: -6px 14px 12px 2px rgba(90, 90, 90, .12);
        /* transition-duration: 0.2s;
        transition: transform 0.2s ease-in-out; */
    }
`;

const hrefList: { to: string, children: string }[] = [
    { to: '/alluser', children: "你可能認識的人" },
    { to: '/messenger', children: "聊天室" },
    // { to: '/todolist', children: "我的代辦清單" }
];





const MyNavBar = () => {
    const location: Location = useLocation();
    const pathName: string = location.pathname;

    let navigate = useNavigate();
    const { searchstate } = useContext(MyContext);
    // console.log("search62", searchstate);

    return (
        <>
            <Header />

        </>
    )
}

const Header: FC = (): JSX.Element => {
    const location: Location = useLocation();
    const pathName: string = location.pathname;

    const [search, setSearch] = useState<string>('');
    const { state: authState, setState } = useContext(MyContext);
    const { setSearchState } = useContext(MyContext);

    let navigate = useNavigate();


    const handleSearch = async (e: React.BaseSyntheticEvent<MouseEvent, EventTarget & HTMLButtonElement, EventTarget>) => {
        e.preventDefault();
        if (search.trim().length > 0) {
            setSearchState({ type: "SEARCH", data: search });
            sessionStorage.setItem("searchvalue", search);

            navigate(`/searchpage/${search}`, { replace: true });
            // alert(search);
        }
    };

    const myanimation = (props: any) => {
        {/* <li><Link to={'/todolist'}>我的代辦清單</Link></li> */ }
        {/* <li><Link to={"/product"}>我的產品</Link></li> */ }
        {/* <li><Link to={"/"}>個人檔案</Link></li> */ }
        return (
            <motion.li whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.9 }}>
                {props.children}
            </motion.li>
        )
    };

    return (
        <motion.header className='navheader'>

            <div className='title'>


                <Link to={"/"}>
                    <img src="/rocket.svg" alt="" />
                </Link>


                <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder='搜尋其他用戶...' name="search" id="" />
                    <BsSearch className='bssearch' />
                    {
                        search.trim().length > 0 &&
                        <button type="submit"
                            onClick={handleSearch}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch}>查詢</button>

                    }
                </form>
            </div>
            <nav>
                <ul className='navmenu'>
                    {
                        hrefList.map((list: { to: string, children: string }, index: number) => {
                            return <React.Fragment key={index}>
                                {myanimation({ children: <Link className='navlist' to={list.to}>{list.children}</Link> })}
                            </React.Fragment>
                        })
                    }



                    {
                        authState.isLoggedIn ?
                            <LogOutButton className='logoutbutton' onClick={async (e) => {
                                // localStorage.clear();
                                e.preventDefault();
                                console.log(authState.userInfo.id);

                                setState({
                                    type: 'LOGOUT',
                                    data: '' as any,
                                    isloggin: false,
                                })
                                sessionStorage.removeItem('token');
                                window.location.reload();
                            }}>登出</LogOutButton> :
                            myanimation({ children: <Link to={"/login"}>{"登入 | 註冊"}</Link> })


                    }

                </ul>



                {/* <ul>
            {
                pathName === "/todolist" ? (
                    <>
                        <li onClick={() => navigate(-1)}>Another Backt To Home Btn</li>
                        <Link to={'/'}>Back To Home</Link>
                    </>
                ) : (
                    <>
                        <Link to={'/todolist'}> <li>ToDo_List</li></Link>
                    </>
                )
            }

        </ul> */}
            </nav>

        </motion.header >
    )

}








export default MyNavBar