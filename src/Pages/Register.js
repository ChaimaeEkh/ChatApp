import React from "react";
import addAvatar from "../img/addAvatar.jpg";

const Register = () => {
    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Shemy Chat</span>
                <span className="title">Register</span>
                <form>
                    <input type="text" placeholder="Display Name"/>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input style={{display: "none"}} type="file" id="file"/>
                    <label htmlFor="file">
                        <img src={addAvatar} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? Login</p>
            </div>
        </div>
    );
};
export default Register;