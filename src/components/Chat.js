
import React, { useState } from 'react'
export default function Chat() {
    const [newMessage, setNewMessages] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(newMessage);
    };
  return (
    <div className="chat-app">
        <form onSubmit={handleSubmit} className="new-message-form">
            <input onChange={(e) => setNewMessages(e.target.value)} className="new-message-input" placeholder="Type your message here" />
            <button className="new-message-button" type="submit">Send</button>
        </form >
    </div>
  )
}