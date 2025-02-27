/* 
import React, { useState, useRef } from "react";
import "./App.css";
import "./style.scss"
import Chat from "./components/Chat";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

const cookies = new Cookies();


export default function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  const signUserOut =async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <div className="App">
        <Auth setIsAuth={setIsAuth}  />
      </div>
    );
  }
  return (
    <div className="App">
      {room ? (
        <Chat room={room} />
      ) : (
        <div className="room">
          <label>Enter Room Name :</label>
          <input ref={roomInputRef} />
          <button onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
        </div>
      )}
      <div className="sign-out">
        <button onClick={signUserOut}>Sign Out</button>
      </div>
    </div>
  );
}
*/


//import Login from "./Pages/Login";
import Home from "./Pages/Home";
//import Register from "./components/Register";
import "./style.scss";

function App() {
  return (
    <div className="App">
     
      <Home />
      {/*<Register />*/} 
    </div>
  )
}

export default App;