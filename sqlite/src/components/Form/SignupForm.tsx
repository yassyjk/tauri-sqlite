import React, { useRef } from 'react';
import { invoke } from "@tauri-apps/api/core";

interface User {
    name: string;
    email: string;
    API: string;
}

const SignupForm: React.FunctionComponent = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const APIRef = useRef<HTMLInputElement>(null);

    const handleSignup = async() => {
        if (!nameRef.current?.value){
            alert("名前を入力してください。");
            return;
        }
        
        try{
            const result = await invoke('signup_user', {
                name: nameRef.current.value,
                email: emailRef.current?.value || "",
                API: APIRef.current?.value || "",
            })
            console.log(result);
            const user: User = {
                name: nameRef.current.value,
                email: emailRef.current?.value || "",
                API: APIRef.current?.value || "",
            } 
            saveUser(user);
            
        } catch(error) {
            console.error(error);
            alert(error);
        }
    };

    const saveUser = (user: User) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("ユーザーが登録されました。");
    };

    return (
        <div>
            <label htmlFor="name">名前</label>
            <input type='text' id="name" ref={nameRef} required></input>
            <label htmlFor="email">メール（必須ではありません）</label>
            <input type='text' id="email" ref={emailRef}></input>
            <label htmlFor="API">API（必須ではありません）</label>
            <input type='text' id="API" ref={APIRef}></input>
            <button onClick={handleSignup}>登録</button>
        </div>
    )
};

export default SignupForm;
