/* eslint-disable no-unused-vars */
import React from "react";
import Header from "./Header";
import FormLogin from "./Fromlogin";


const Login = () => {


    return (
        <>
            <Header />
            <div className="login-container flex justify-center items-center max-h-[100vw] w-full bg-gray-100 overflow-hidden">
            <FormLogin />
            </div>
           
        </>
    );
};

export default Login;
