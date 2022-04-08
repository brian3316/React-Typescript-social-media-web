import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import MyContext from '../../context/MyContext';
import Messg from '../Chat/Messg';

interface UserCon {
    roomid: string | number;
    userId: string | number;
    userName: string;
}

interface ChatMsg {
    roomid: string | number;
    senderId: string | number;
    senderName: string;
    text: string;
    type: string;
    createAt: string | Date;
}


function ChatMsg({ roomid, chatmessages, setChatMessages }: any) {
    const { state: authState } = useContext(MyContext);

    const [userconnec, setUserConnec] = useState<any[]>([]);

    const scrollRef = useRef<any>(null);

    const [sendmessage, setSendMessage] = useState<string>('');

    const socket = useRef<null | any>(null);

    const textareaRef = useRef<any>();


    useEffect(() => {
        socket.current = io("http://localhost:3300");
        socket.current.emit('user_connected', { roomid, userId: authState.userInfo.id, userName: authState.userInfo.name, createAt: new Date() });
        socket.current.on("message", (data: any) => {
            //設定連線者
            setUserConnec((prev: any[]) => [...prev, data]);
            // console.log("42message", data);
        });

        socket.current.on("leave_message", (data: any) => {
            // console.log("leave_message", data);
        });
        return () => {
            socket.current.emit('user_disconnect', { roomid, userId: authState.userInfo.id, userName: authState.userInfo.name, createAt: new Date(), message: `${authState.userInfo.name} disconnect !!!` });

            socket.current.disconnect();
        }


    }, []);

    useEffect(() => {

        socket.current.on("user_receivemessage", (data: any) => {
            setChatMessages((prev: any) => [...prev, data]);
            // console.log("user_receivemessage", data);
        });
        return () => socket.current.disconnect();

    }, []);

    const chatSubmitButton = async (e: any) => {
        e.preventDefault();
        const message: string = sendmessage;
        const msgobj = {
            roomid,
            senderId: authState.userInfo.id,
            senderName: authState.userInfo.name,
            text: message,
            type: 'message',
            createAt: new Date()
        };
        if (message.trim().length > 0) {
            // console.log(msgobj);
            socket.current.emit('user_sendmessage', msgobj);
            await axios.post('http://localhost:3300/api/test2/updatemessages', msgobj);
            textareaRef.current.value = '';


        };



        // const { data } = await axios.post('http://localhost:3300/api/test2/chatting', {
        //     chatmessage
        // })
        // console.log(data);

    };

    useEffect(() => scrollRef?.current?.scrollIntoView({ behavior: "smooth" }));

    return (
        <>
            <div className="chatBoxTop" >
                {
                    chatmessages.map((msg: ChatMsg, i: any) => {
                        return (
                            <div ref={scrollRef} key={i}>
                                <Messg own={msg.senderName === authState.userInfo.name ? true : false} message={msg} />

                            </div>


                        )
                    })
                }


            </div>
            <div className="chatBoxBottom" >

                <textarea
                    ref={textareaRef}
                    className='chatMessageInput'
                    placeholder='寫給對方的訊息...'
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSendMessage(e.target.value)}
                    name=""
                    id=""></textarea>
                <button className='chatSubmitButton'
                    onClick={chatSubmitButton} >傳送</button>

            </div>
        </>
    )
}

export default ChatMsg