import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { getDocs, collection } from "firebase/firestore";

const Login = () => {
  const [err, setErr] = useState(false);
  const [users, setUsers] = useState([]); 
  const navigate = useNavigate();
  const collectionRef = collection(db, "users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collectionRef);
        const usersList = snapshot.docs.map(doc => doc.data());
        setUsers(usersList);
      } catch (error) {
        console.error("Error while retrieving data :", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const userExists = users.some(user => user.email === email);

    if (!userExists) {
      setErr(true);
      alert("User not found. Please check your email.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setErr(true);
      alert("Incorrect password or connection issue.");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Shemy Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign in</button>
          {err && <span style={{ color: "red" }}>An error occurred.</span>}
        </form>
        <p>Don't have an account ? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
