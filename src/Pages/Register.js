import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import addAvatar from "../img/addAvatar.jpg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore"; 

const Register = () => {
    const [err, setErr] = useState(false);
    const [data, setData] = useState({
        displayName: "",
        email: "",
        password: "",
        file: null,
        imageBase64: "" // Stockage de l'image convertie en Base64
    });

    const navigate = useNavigate();
    const collectionRef = collection(db, "users");

    // Convertir l'image en Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convertir en Base64
            reader.onload = () => {
                setData({ ...data, imageBase64: reader.result });
            };
            reader.onerror = (error) => {
                console.error("Erreur de conversion de l'image :", error);
            };
        }
    };

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
                email: data.email,
                password: data.password,
                avatar: data.imageBase64 
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
                    <input style={{ display: "none" }} type="file" id="file" onChange={handleFileChange} />
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
