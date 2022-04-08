import axios from 'axios';
import moment from 'moment';
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { unsplashIMG } from '../../utils/showImage';
import ChatMsg from './ChatMsg';



const Message = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 12px;

    .messageTop{
        display: flex;
    }
    
    .messageImg{
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
    }

    .messageText{
        padding: 10px;
        border-radius: 20px;
        /* background-color: #1877f2;
        color: white; */
        background-color: rgb(245,241,241);       
        color:black;
        max-width: 300px;
    }
    .messageBottom{
        font-size: 12px;
        margin-top: 10px;
    }

    
`;

const Div = styled.div`

    .own{
        align-items: flex-end;
    }
    .own .messageText{
        
        background-color: #1877f2;
        color: white;

        /* background-color: rgb(245,241,241);       
        color:black; */
    }
`;
interface Props {
    own: boolean;
    message: ChatMsg;
}

function Messg({ own, message }: Props) {






    return (
        <Div >
            <Message className={own ? 'own' : ''}>
                <div className="messageTop">
                    <img
                        className="messageImg"
                        src={unsplashIMG()[0]?.urls?.small}
                        alt=""
                    />
                    <p style={{ fontSize: '10px', position: 'relative', color: (own ? 'blue' : 'gray') }}>{message.senderName}</p>
                    <p className="messageText" >{message.text}</p>
                    {/* <p className="messageText">{message.text}</p> */}

                </div>
                {/* <div className="messageBottom">1 hour age</div> */}
                {/* <div className="messageBottom">{message.createdAt}</div> */}
                <div className="messageBottom">{moment(`${message.createAt}`).fromNow()}</div>

            </Message>

        </Div>
    )
}

export default Messg