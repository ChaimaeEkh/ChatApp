import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addAvatar from "../img/addAvatar.jpg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore"; 

const Register = () => {
    const [err, setErr] = useState(false);
    const [data, setData] = useState({
        displayName: "",
        email: "",
        password: "",
        file: null
    });

    const navigate = useNavigate();  // Initialize navigate
    const collectionRef = collection(db, "users");

    const handleInput = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: data.displayName });

            await addDoc(collectionRef, {
                uid: user.uid,
                displayName: data.displayName,
                email: data.email
            });

            alert("Registration Successful!");

            navigate("/login"); 

        } catch (error) {
            setErr(true);
            alert(error.message);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Shemy Chat</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input id="displayName" type="text" placeholder="Display Name" onChange={handleInput} />
                    <input id="email" type="email" placeholder="Email" onChange={handleInput} />
                    <input id="password" type="password" placeholder="Password" onChange={handleInput} />
                    <input style={{ display: "none" }} type="file" id="file" onChange={(e) => setData({ ...data, file: e.target.files[0] })} />
                    <label htmlFor="file">
                        <img src={addAvatar} alt="" />
                        <span>Add an avatar</span>
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
                {err && <p style={{ color: 'red' }}>Something went wrong</p>}
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Register;
