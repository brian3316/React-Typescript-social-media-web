

import React, { useCallback, useRef, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Slider, { Settings } from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyContext from "../context/MyContext";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import 'moment/locale/zh-tw';
import { motion } from "framer-motion";
import bgimg from '../Components/bg.jpg';




const Div = styled.div`
    animation-name: animation;
    animation-duration: 2s;
    animation-timing-function: ease;

    margin:0 10%;

    @keyframes animation{
        from{
            transform: scale(0);
        }to{
            transform: scale(1);
        }
    }
`;

const Msg = styled.div`
    display: table;   
    width: 100%;
    height: 100vh; 
    background-image:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgimg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

`;

const MsgH1 = styled(Div)`
    font-size: 50px;
    color: white;
    font-weight: 1000;
    margin-top: 400px;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.2);
`;


const NSlider = styled(motion.div)`

    cursor: grab;
    overflow: hidden;

    .item-div{
        width: 30rem;
        padding: 0px 40px;
    }
    .item-div img {
        /* width: 100%; */
        /* height: 100%; */
        border-radius: 2rem;
        pointer-events: none;
    }
    .inner-nslider{
        display: flex;
    }
`;



export default function Home() {
    const { state } = useContext(MyContext);
    const [img, setImg] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);

    useEffect(() => {

        // console.log("47 home", state.userInfo);
        // console.log("48 home", state.userInfo?.name && state.userInfo.name);

        if (state.userInfo?.name === undefined) {
            window.location.reload();
            // console.log("finally i founded you");

        }

        if (!localStorage.getItem("unsplash")) {
            const axiosdata = async () => {
                setLoading(true);
                // const data = [...Array(10)].map((_, i: number) => ({
                //     ...faker.helpers.contextualCard(),
                //     id: i
                // }));
                const { data } = await axios.get("https://api.unsplash.com" + "/photos/random?count=12", {
                    headers: {
                        Authorization: "Client-ID " + process.env.REACT_APP_UNSPLASH_CLIENT_ID
                    }
                });

                localStorage.setItem("unsplash", JSON.stringify(data));

                return data;
            };

            axiosdata()
                .then((data) => {

                    setImg(data.map((item: any) => {
                        // console.log(item.urls.small);

                        return item.urls.small
                    }

                    ));
                    setLoading(false);
                    // setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

                    // console.log(localStorage.getItem("unsplash"));

                }).then(() => {
                    setTimeout(() => {
                        setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

                    }, 600);
                });

        } else {
            const data = JSON.parse(localStorage.getItem("unsplash") || "[]");
            const test1 = async () => {
                setImg(data.map((item: any) =>
                    item.urls.small));
                setLoading(false);

            };
            test1().then(() => {

                setTimeout(() => {
                    setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);

                }, 500);
            })


            // console.log(data);

        }




    }, [state.isLoggedIn]);







    const [width, setWidth] = useState<number>(0);
    const carousel = useRef<any>();


    // useEffect(() => {
    //     if (loading === false) {

    //         console.log(carousel.current?.offsetWidth);
    //         setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
    //     }

    // }, [loading, img]);

    return (
        <>

            {
                state.isLoggedIn ?
                    <>
                        {
                            state.userInfo?.name?.length > 0 &&
                            <>
                                <h1>歡迎 {state.userInfo?.name} 回來.</h1>
                                <Div>
                                    <NSlider ref={carousel} whileTap={{ cursor: "grabbing" }}>
                                        <motion.div className="inner-nslider"
                                            drag="x"
                                            dragConstraints={{ right: 0, left: -width }}
                                        >
                                            {
                                                img.map((item: any, index: number) => {
                                                    return <motion.div className="item-div" key={index} whileTap={{ scale: 0.9 }}>
                                                        <img sizes="400px" src={item} alt="" />
                                                    </motion.div>
                                                })
                                            }
                                        </motion.div>
                                    </NSlider>


                                    {/* <div style={{ height: '100vh', margin: '0 auto', position: 'relative' }}>
                                        <Slider {...settings}>

                                            {
                                                img.map((item: any, index: number) => {
                                                    return <div key={index}>
                                                        <img sizes="400px" src={item} alt="" />
                                                    </div>
                                                })
                                            }



                                        </Slider>



                                    </div> */}
                                </Div>
                            </>
                        }

                    </>
                    :
                    <Msg >
                        <MsgH1>請先登入帳戶...</MsgH1>
                    </Msg>
            }


            {/* <Outlet />  */}
        </>
    );
}