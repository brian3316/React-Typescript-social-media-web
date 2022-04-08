import { DefaultEventsMap } from '@socket.io/component-emitter';
import axios from 'axios';
import moment from 'moment';
import React, { ButtonHTMLAttributes, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components'
import MyContext from '../../context/MyContext';
import ChatMsg from './ChatMsg';
import MyChatOnline from './ChatOnline';
import Conversation from './Conversation';

interface Friend {
    id: string | number;
    name: string;
    email: string;
    friends: string | string[];
    isloggin: boolean;
    password: string;
    token: string;
}




const MsDiv = styled.div`
    height: calc(100vh - 50px);
    display: flex;
    
`;

const ChatMenu = styled.div`
    flex:3.5;
`;

const ChatMenuWrapper = styled.div`
    padding: 10px;
    height: 100%;

    .chatMenuInput{
        width: 90%;
        padding: 10px 0;
        border:none;
        border-bottom: 1px solid gray;
       &:focus{
        border:none;
        outline: none;
        border-bottom: 1px solid gray;

        }
    }
`;

const ChatBox = styled.div`
    flex:5.5;

`;

const ChatBoxWrapper = styled.div`
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .chatBoxTop{
        height: 100%;
        overflow-y: scroll;
        padding-right: 13px;
        /* overflow-wrap: break-word; */
        word-wrap: break-word;
    }
    
    .chatBoxBottom{
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .chatMessageInput{
        width: 80%;
        height: 90px;
        padding: 10px;
    }

    .chatSubmitButton{
        width: 70px;
        height: 40px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: teal;
        color: white;

    }
    .noConversationText{
        position: absolute;
        top:10%;
        font-size: 50px;
        color: rgb(224,220,220);
        cursor: default;
    }
   
`;

const ChatOnline = styled.div`
    flex:3;

`;

const ChatOnlineWrapper = styled.div`
    padding: 10px;
    /* background-color: aqua; */
    height: 100%;

`;




const a = true;

interface IProps {
    myname: string;
};






function Messenger({ myname }: IProps) {
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(0);

    const [roomid, setRoomId] = useState<string>('');

    const [show, setShow] = useState<boolean | null>(false);
    const [searchfriend, setSearchFriend] = useState<string>('');

    const { state: authState } = useContext(MyContext);

    const [chatmessages, setChatMessages] = useState<ChatMsg[]>([]);



    useEffect(() => {


        const axiosAllUser = async () => {
            setLoading(1);
            const { data } = await axios.get<any[]>('http://localhost:3300/api/test1/alluser');
            console.log(data);
            const { friends } = await data.find((item: any) => item.id === authState?.userInfo?.id);
            const myFriends = JSON.parse(authState.userInfo.friends);
            setFriends(data.filter((item: any) => {
                return myFriends.includes(item.id) && item.id !== authState.userInfo.id
            }));
            console.log(friends);

        };
        if (authState.userInfo.id) {

            axiosAllUser().then(() => {
                setLoading(2);
            });
        }
    }, [authState.userInfo]);


    // useEffect(() => scrollRef.current.scrollIntoView({ behavior: "smooth" }));

    // useEffect(() => {
    //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });

    // }, [])





    const showConversation = async (e: any, friend: Friend) => {
        // console.log("249", friends);

        const targetfriend = friends.find((item: any) => item.name === friend.name);
        // console.log(targetfriend);
        const _id = [authState.userInfo.id, targetfriend.id];
        try {
            const { data, data: { messages } } = await axios.post('http://localhost:3300/api/test2/getchat', {
                _id
            });
            console.log(JSON.parse(messages), data);
            setChatMessages(JSON.parse(messages));
            setRoomId(data.chatroomid);
            setShow(true);

        } catch (error) {
            console.log(error);

        }

    };

    return (
        <MsDiv>
            {
                loading === 2 && friends.length > 0 ?
                    <>


                        <ChatMenu>
                            <ChatMenuWrapper>
                                <input type="text" onChange={(e) => setSearchFriend(e.target.value)} className='chatMenuInput' placeholder='Search for friends...' name="" id="" />
                                {
                                    friends.length > 0 && friends.filter((item: any) => {
                                        if (searchfriend.trim().length > 0) {
                                            return item.name.toLowerCase().includes(searchfriend.toLowerCase())
                                        } else {
                                            return item;
                                        }

                                    }).map((friend: Friend, i: any) => {
                                        // console.log("255", friend);

                                        return (
                                            <div key={friend.id} onClick={(e) => { showConversation(e, friend) }}>
                                                <Conversation num={i} currentuser={authState.userInfo} name={friend.name} />
                                            </div>
                                        )


                                    })
                                }


                            </ChatMenuWrapper>
                        </ChatMenu>
                        <ChatBox>

                            <ChatBoxWrapper>
                                {
                                    show ?
                                        <ChatMsg roomid={roomid} chatmessages={chatmessages} setChatMessages={setChatMessages} />


                                        :
                                        <span className='noConversationText'>
                                            目前沒有對話...
                                        </span>
                                }

                            </ChatBoxWrapper>
                        </ChatBox>
                        <ChatOnline>

                            <ChatOnlineWrapper>
                                {/* <MyChatOnline /> */}
                            </ChatOnlineWrapper>

                        </ChatOnline>
                    </> : (
                        <h1>目前還沒有朋友喔!!</h1>
                    )
            }
            {
                loading === 1 || 0 ?
                    <h1>
                        Loading...
                    </h1>
                    : <>
                    </>
            }
        </MsDiv>
    )
}

export default Messenger