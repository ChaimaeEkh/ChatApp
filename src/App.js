import React, { useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  if (!isAuth) {
    return (
      <div className="App">
        <Auth />
      </div>
    );
  }
  return (
    <div className="App">
      {room ? (
        <div> Chat </div>
      ) : (
        <div className="room">
          <label>Enter Room Name :</label>
          <input />
          <button>Enter Chat</button>
        </div>
      )}
    </div>
  );
}
