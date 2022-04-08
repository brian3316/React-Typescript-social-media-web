import axios from 'axios';
import styled, { AnyStyledComponent } from 'styled-components'
import { unsplashIMG } from '../../utils/showImage';


const ConversationDiv = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    margin-top: 20px;

    &:hover{
        background-color: rgb(245,243,243);
    }

    .conversationImg{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 20px;

    }
    .conversationName{
        font-weight: 700;
    }

`;



interface Props {
    friends: friend[];
}
interface friend {
    id: string;
    email: string;
    friends: any;
    name: string;
    password: string;
    token: string;
}


function Conversation({ name, currentuser, num }: any) {






    return (
        <ConversationDiv >

            <img
                className='conversationImg'
                src={unsplashIMG()[num]?.urls?.small}
                alt=""
            />
            <span className='conversationName'>{name}</span>



        </ConversationDiv>
    )
}

export default Conversation