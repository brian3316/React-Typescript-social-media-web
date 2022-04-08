import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import MyContext from '../../context/MyContext';
import { BsPersonPlusFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { unsplashIMG } from '../../utils/showImage';

const Div = styled.div`
    display: flex;
    justify-content:center;
    flex-direction: column;


`;


const UserDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    overflow: auto;
    overscroll-behavior: contain;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    width: 100%;
    height: 100vh;
    /* padding: 30px 0; */
    background-color: whitesmoke; 
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

interface UserType {
    id: string | number;
    name: string;
    email: string;
    friends: string;
    isloggin: boolean;
    isadd: boolean;
};


function SearchPage() {

    const { state: authState, searchstate, searchstate: { value: searchvalue } } = useContext(MyContext);

    const [alluser, setAllUser] = useState<UserType[]>([]);
    const [img, setImg] = useState<any[]>([]);

    let { sevalue }: any = useParams();




    useEffect(() => {

        const Test1 = async () => {
            const { data } = await axios.get<any[]>("http://localhost:3300/api/test2/usersearch", {
                params: {
                    searchvalue: searchvalue || sevalue
                }
            })
            console.log(data);

            data.filter((item: UserType, index: any) => {
                // console.log(item)
                const value = searchvalue.trim().length > 0 ? searchvalue : sevalue;
                if (item.name.toLowerCase().includes(value.toLowerCase())) {
                    setAllUser([{
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        friends: JSON.parse(item.friends),
                        isloggin: item.isloggin,
                        isadd: false,
                    }]);
                };


            })

        };
        Test1().then(() => setImg(unsplashIMG()));
        console.log(`157 searchstate ${searchvalue}`);

    }, [searchstate]);

    const addFriend = async (e: React.SyntheticEvent | any) => {
        e.preventDefault();

        const receiverEmail = e.target[0].value;
        const receiver: any = alluser.find((item: UserType) => item.email === receiverEmail);
        const { id: receiverId } = receiver;
        const senderId = authState.userInfo.id;
        const senderfriendsId: any = [alluser.find((item: UserType) => item.id === senderId)?.friends];

        if (!senderfriendsId.some((friendsid: string) => friendsid === receiverId)) {

            try {
                const { data } = await axios.post('http://localhost:3300/api/test1/addfriend', {
                    receiverId,
                    senderId
                });
                // console.log(data);
            } catch (error) {
                console.log(error);
            }

        };

        const new_alluser = alluser.map((item: UserType) => {
            if (item.id === receiverId) {
                item.isadd = true;

            }
            return item;
        });
        setAllUser(new_alluser);
        console.log(new_alluser);
        window.location.reload();


        // alert("以成為朋友!!");

    };

    type AddProps = { isadd: boolean };

    const AddButton = ({ isadd }: AddProps) => {
        const mystyle = isadd && {
            style: {
                backgroundColor: "red",
                marginTop: "0px",
                paddingTop: "10px",
                alignItems: "center",
                color: "white",
                width: "100px",
                height: "40px",
                borderRadius: "10px",
                cursor: "not-allowed",
                transition: "none"

            },
            disabled: true
        };
        return (
            <>
                {
                    isadd ? <p {...mystyle}>已成為朋友</p>
                        :
                        <MyButton type='submit' >
                            <BsPersonPlusFill className='BsPersonPlusFill' size={30}></BsPersonPlusFill>

                        </MyButton>
                }

            </>


        )
    };

    const ShowNoFriend = (alluser: any[]) => {
        if (alluser.length === 0) {

            return (
                <>
                    <h1>您搜尋{searchvalue || sevalue}，並沒有匹配到相關結果</h1>
                </>
            )
        } else {
            return (
                <>
                    <h1>您搜尋{searchvalue || sevalue}的相關結果</h1>
                </>
            )
        }

    };




    return (
        <Div>
            <UserDiv>
                {ShowNoFriend(alluser)}
                {
                    alluser.length > 0 &&
                    alluser.map((item: UserType, index: number) => {
                        return (
                            <div key={index}>
                                {
                                    item.id != authState.userInfo?.id &&
                                        img.length > 0 &&
                                        !JSON.parse(authState.userInfo.friends).some((friendId: string) => friendId === item.id) ?

                                        <MyDiv key={item.id} onSubmit={addFriend}>
                                            <img src={img[index].user.profile_image.large} alt="" />

                                            <MyDiv2>
                                                <p>{item.name}</p>
                                                <p>{item.friends.length === 0 ? "新用戶!!!" : `已有${item.friends.length}朋友`}</p>
                                                {/* <p id={`email${index}`} className='email'>Email:{item.email}</p> */}
                                                <input type="text" value={item.email} disabled name="email" id="" />
                                            </MyDiv2>
                                            <AddButton isadd={item.isadd} />

                                        </MyDiv>
                                        :

                                        img.length > 0 && <MyDiv key={item.id}>
                                            <img src={img[index].user.profile_image.large} alt="" />

                                            <MyDiv2>
                                                <p>{item.name}</p>
                                                <p>{item.friends.length === 0 ? "新用戶!!!" : `已有${item.friends.length}朋友`}</p>
                                                {/* <p id={`email${index}`} className='email'>Email:{item.email}</p> */}
                                                <input type="text" value={item.email} disabled name="email" id="" />
                                            </MyDiv2>
                                            <AddButton isadd={true} />

                                        </MyDiv>



                                }


                            </div>




                        )
                    })
                }
            </UserDiv>
        </Div>
    )
}

export default SearchPage