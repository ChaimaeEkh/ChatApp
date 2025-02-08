import React, { useState, useRef } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
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
    </div>
  );
}
