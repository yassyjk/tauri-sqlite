import React, { useRef } from 'react';
import { invoke } from "@tauri-apps/api/core";
import "./SignupForm.css";

interface User {
    name: string;
    email: string;
    API: string;
}

interface Props{
    setShowAlert: (show: boolean) => void;
    setAlertMessage: (message: string) => void;
}

const SignupForm: React.FunctionComponent<Props> = ({ setShowAlert, setAlertMessage }) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const APIRef = useRef<HTMLInputElement>(null);

    const handleSignup = async () => {
        if (!nameRef.current?.value){
            setAlertMessage("名前を入力してください。");
            setShowAlert(true);
            return;
        }
        
        try{
            const result = await invoke('signup_user', {
                name: nameRef.current.value,
                email: emailRef.current?.value || "",
                api: APIRef.current?.value || "",
            })
            console.log(result);
            const user: User = {
                name: nameRef.current.value,
                email: emailRef.current?.value || "",
                API: APIRef.current?.value || "",
            } 
            saveUser(user);

        } catch(error: any) {
            console.error(error);
            setAlertMessage(error.toString());
            setShowAlert(true);
        }
    };

    const saveUser = (user: User) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        setAlertMessage(user.name + "が登録されました。");
        setShowAlert(true);
    };

    return (
        <div>
            <div className='form-container'>
                <label htmlFor="name">名前</label>
                <input type='text' id="name" ref={nameRef} required></input>
                <label htmlFor="email">メール（必須ではありません）</label>
                <input type='text' id="email" ref={emailRef}></input>
                <label htmlFor="API">API（必須ではありません）</label>
                <input type='text' id="API" ref={APIRef}></input>
                <button onClick={handleSignup}>登録</button>
            </div>
        </div>
    )
};

export default SignupForm;
