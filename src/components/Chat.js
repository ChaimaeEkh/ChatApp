import {addDoc, collection, serverTimestamp, onSnapshot, query, where} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {auth, db} from '../firebase-config'
import './Chat.css'

export default function Chat(props) {
    const {room} = props;
    const [newMessage, setNewMessages] = useState("");
    const messagesRef = collection(db, "messages");
    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", room));
        onSnapshot(queryMessages, (snapshot) => {
            
        });
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newMessage === "") return;
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
        });
        setNewMessages("");
        console.log(newMessage);    };
  return (
    <div className="chat-app">
        <form onSubmit={handleSubmit} className="new-message-form">
            <input onChange={(e) => setNewMessages(e.target.value)}
            value={newMessage} className="new-message-input" placeholder="Type your message here" />
            <button className="new-message-button" type="submit">Send</button>
        </form >
    </div>
  )
}