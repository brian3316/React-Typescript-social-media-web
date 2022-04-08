import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import MyContext from '../../context/MyContext';
import { BsPersonPlusFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { unsplashIMG } from '../../utils/showImage';




interface UserType {
    id: string | number;
    name: string;
    email: string;
    friends: string;
    isloggin: boolean;
}

const Div = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 85vh;
    
    .title{
        margin-top: 30px;
        background: #333;
        display: flex;
        color: white;
        border-radius:999px;
    }
    .title:before,
    .title:after {
        content: '';
        margin: auto 1em;
        border-bottom: solid 1px;
        flex: 1;
    }
    
    .title h1{
        position: relative;
        padding: 0.25em 1em;
        overflow: hidden;
        background: linear-gradient(currentcolor, currentcolor) no-repeat top center, linear-gradient(currentcolor, currentcolor) no-repeat bottom center;
        background-size: calc(100% - 1.65em) 1px;
    }
    .title h1:before,
    .title h1:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: solid 1px;
        border-top: none;
        border-bottom: none;
        transform: skew(45deg);
    }

    .title h1:after {
        transform: skew(-45deg);
    }
   
`;

const UserDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    overflow: auto;
    overscroll-behavior: contain;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    width: 500px;
    height: 350px;
    padding: 30px 0;
    background-color: #ddd; 
    margin: 3rem;
    img{
        width: 100px;
        height: 100px;
        margin-left: 5px;
        border-radius: 999px;
        object-fit: cover;
        cursor: pointer;
    }
    img:hover{
        opacity: 0.5;
    }
`;

const MyDiv = styled.form`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    margin: 18px 0;
    margin-left: 5px;
    padding: 10px 0;
    background: white;
    border-radius: 0% 0% 0% 0% / 0% 0% 0% 0% ;
    color: white;
    box-shadow: 15px 15px rgba(0,0,0,.15);
    transition: all .4s ease;
    &:hover{
        border-radius: 0% 0% 50% 50% / 0% 0% 5% 5% ;
        box-shadow: 10px 10px rgba(0,0,0,.25);
    }
`;
const MyDiv2 = styled.div`
    display: flex;
    /* padding: 0 10px; */
    margin: auto 3px;
    margin-left: 5px;
    width:300px;
    justify-content: flex-start;
    flex-direction: column;
    p,input[type="text"]{
        height: 40px;
        margin: 1px 0;
        font-weight: bolder;
        color:black;
    
    }
    input[type="text"]{
        background: none;
        border:none;
        margin-bottom: 3px;
        color:black;
        font-size: 22px;

    }
    input[type="text"]:focus{
        background: white;
        border:1px solid grey
    }
`;

const MyButton = styled.button`
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	outline: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    margin-right: 5px;
    /* top: 100px; */
    background-color: gray;
    border-radius: 999px;
    transition: all .2s ease-in-out;

    .BsPersonPlusFill{
        position: relative;
        /* top: 50px; */
        cursor: pointer;
        transition: all .2s ease-in-out;
    }
    
    .BsPersonPlusFill:active{
        transform: scale(0.8);

    }
    &:hover{
        transform: scale(1.1);
        cursor: pointer;
    }
    &:active{
        transform: scale(0.8);
    }
    
`;


function AllUser() {
    const [alluser, setAllUser] = useState<UserType[]>([])
    const [img, setImg] = useState<any[]>([]);

    const { state: authState } = useContext(MyContext);

    const Test1 = async () => {
        const { data } = await axios.get("http://localhost:3300/api/test1/alluser")
        // console.log(data);

        data.map((item: UserType, index: any) => {
            // console.log(item)

            setAllUser(prev => [...prev, {
                id: item.id,
                name: item.name,
                email: item.email,
                friends: JSON.parse(item.friends),
                isloggin: item.isloggin
            }])

        })

    };

    useEffect(() => {

        Test1().then(() => setImg(unsplashIMG()));
    }, [])




    const addFriend = async (e: React.SyntheticEvent | any) => {
        e.preventDefault();
        const receiverEmail = e.target[0].value;
        const receiver: any = alluser.find((item: UserType) => item.email === receiverEmail);
        const { id: receiverId } = receiver;
        const senderId = authState.userInfo.id;
        const senderfriendsId: any = alluser.find((item: UserType) => item.id === senderId)?.friends;
        if (!senderfriendsId.some((friendsid: string) => friendsid === receiverId)) {

            try {
                const { data } = await axios.post('http://localhost:3300/api/test1/addfriend', {
                    receiverId,
                    senderId
                });
                // console.log(data);
                alert("以成為朋友!!");
            } catch (error) {
                console.log(error);
            }

        }
        // console.log(receiverId);

        window.location.reload();


        //need to send sender id and receiver id in node.js server and mysql 03/29
        // let test1 = { name: 'john', friends: ['123'] }
        // test1 = { ...test1, friends: [...test1.friends, "456"] };
        // console.log(test1); 

    };

    return (
        <Div>
            <div className='title'>
                <h1>為您推薦的使用者</h1>

            </div>
            <UserDiv>
                {
                    alluser.length > 0 &&
                    alluser.map((item: UserType, index: number) => {
                        return (
                            <div key={index}>
                                {
                                    item.id != authState.userInfo?.id &&
                                    img.length > 0 &&
                                    !JSON.parse(authState.userInfo.friends).some((friendId: string) => friendId === item.id) &&

                                    <MyDiv key={item.id} onSubmit={addFriend}>
                                        <img src={img[index].user.profile_image.large} alt="" />

                                        <MyDiv2>
                                            <p>{item.name}</p>
                                            <p>{item.friends.length === 0 ? "新用戶!!!" : `已有${item.friends.length}朋友`}</p>
                                            {/* <p id={`email${index}`} className='email'>Email:{item.email}</p> */}
                                            <input type="text" value={item.email} disabled name="email" id="" />
                                        </MyDiv2>
                                        <MyButton type='submit'>
                                            <BsPersonPlusFill className='BsPersonPlusFill' size={30}></BsPersonPlusFill>

                                        </MyButton>

                                    </MyDiv>

                                }


                            </div>




                        )
                    })
                }
            </UserDiv>
        </Div >
    )
}

export default AllUser