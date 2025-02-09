import React from "react";

const Register = () => {
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <form>
                    <span>Register</span>
                    <input type="text" placeholder="Display Name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input type="file"/>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? Login</p>
            </div>
        </div>
    );
};