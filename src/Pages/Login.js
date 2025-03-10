import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import {getDocs, collection } from "firebase/firestore"; 

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
   const collectionRef = collection(db, "users");

  const getData = async () => {
    try {
        const snapshot = await getDocs(collectionRef);
        const users = snapshot.docs.map(doc => doc.data());
        console.log(users);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;