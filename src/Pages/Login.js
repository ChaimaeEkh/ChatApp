import React from "react";

const Login = () => {
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Shemy Chat</span>
                <span className="title">Login</span>
                <form>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button type="submit">Sign in</button>
                </form>
                <p>You don't have an account? Register</p>
            </div>
        </div>
    );
};
export default Login;