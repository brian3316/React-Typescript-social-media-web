import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import MyContext from '../context/MyContext';

const FormDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: black;
    color:white;
    
`;

const MyForm = styled.form`
    display: flex;
    flex-direction: column;
    padding: 10px auto;
    margin-top: 10px;


    input{
        margin:10px auto;
        width: 300px;

    }
    button{
        margin:10px auto;
        width:300px;
        height: 50px;
        border-radius: 10px;
    }
    button:hover{
        transition: all 0.3s ease-in-out;
        background-color:red;
        cursor: pointer;
    }

    input[type="email"] {
    }
`;

const MyLink = styled.a`
    cursor: pointer;
    padding-bottom: 50px;
    margin-bottom: 50px;
`;


function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loginemail, setLoginEmail] = useState<string>('');
    const [loginpassword, setLoginPassword] = useState<string>('');

    const [loginorregister, setLoginOrRegister] = useState<number>(2);
    let navigate = useNavigate();

    const { setState } = useContext(MyContext);




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | any) => {
        const firstName = "brain";
        const lastName = "saket";

        e.preventDefault();


        try {
            await axios.post("http://localhost:3300/api/test1/register", {
                firstName: e.target[0].value,
                lastName: e.target[1].value,
                email,
                password
            }).then(res => {
                const { data } = res;
                // console.log(data);
                setLoginOrRegister(1)
            }).then(() => window.location.reload());
        } catch (error: any) {
            const { data } = error.response;
            console.log(data);

        }


    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginemail.replaceAll(" ", '').length > 0 && loginpassword.replaceAll(" ", '').length > 0) {
            try {
                localStorage.removeItem('token');
                const { data } = await axios.post("http://localhost:3300/api/test1/login", {
                    email: loginemail,
                    password: loginpassword
                });


                const { token } = await data.userinfo;
                const { isloggin } = await data.userinfo;
                // const loginstate = await isloggin ? true : false;


                // localStorage.setItem('token', token);
                Promise.all([data, token, isloggin]).then(([data, token, isloggin]) => {
                    sessionStorage.setItem('token', token);
                    setState({
                        type: 'LOGIN',
                        data: data,
                        isloggin: isloggin ? true : false,
                    })
                }).then(() => {
                    navigate("/", { replace: true });
                })



                // console.log(data?.userinfo);
            } catch (error: any) {
                console.log(error.response.data);
                alert(error.response.data.message || error)

            }

        };
    }
    return (

        <FormDiv>
            <div>
                <h1><MyLink onClick={() => setLoginOrRegister(1)}>註冊</MyLink> | <MyLink onClick={() => setLoginOrRegister(2)}>登入</MyLink></h1>
            </div>
            {
                loginorregister === 1 &&
                <MyForm onSubmit={handleSubmit} action="">
                    <h1>註冊</h1>
                    <label htmlFor="firstName">姓氏：</label>
                    <input type="text" name='firstName' required id='firstName' placeholder="firstName..." />
                    <label htmlFor="lastName">名字：</label>
                    <input type="text" name='lastName' required id='lastName' placeholder="lastName..." />

                    <label htmlFor="loginemail">Email：</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name='loginemail' required id='loginemail' placeholder="email..." />
                    <label htmlFor="loginpassword">Password：</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name='loginpassword' required id='loginpassword' placeholder="password..." />
                    <button type='submit'>註冊</button>
                    <hr />
                </MyForm>
            }
            {
                loginorregister === 2 &&
                <MyForm onSubmit={handleLogin} onKeyDown={(e) => e.key == "Enter" && handleLogin}>
                    <h1>登入</h1>

                    <label htmlFor="email">Email：</label>
                    <input value={loginemail} onChange={(e) => setLoginEmail(e.target.value)} type="email" name='email' required id='email' placeholder="useremail..." />
                    <label htmlFor="password">Password：</label>
                    <input value={loginpassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" name='password' required id='password' />
                    <button type='submit'>登入</button>
                </MyForm>
            }
        </FormDiv>

    )
}

export default Login