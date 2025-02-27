import {addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import {auth, db} from '../firebase-config'
import './Chat.css'

export default function Chat(props) {
    const {room} = props;
    const [newMessage, setNewMessages] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");
    useEffect(() => {
        const queryMessages = query(messagesRef, 
            where("room", "==", room),
            orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];  
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, []);


    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Intl.DateTimeFormat('fr-FR', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(timestamp.toDate());
    };
    

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
              <div className='header'>
                <h1>Welcome to: {room.toUpperCase()}</h1>
              </div>
              <div className="messages-container">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.user === auth.currentUser.displayName ? 'own' : ''}`}>
                    <div className="message-avatar">
                      <img src={`https://ui-avatars.com/api/?name=${message.user}&background=random`} alt={message.user} />
                    </div>
                    <div className="message-content">
                      <span className='user'>{message.user}</span>
                      <div className="message-bubble">
                        {message.text}
                      </div>
                      <div className="timestamp">{formatTimestamp(message.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="new-message-form">
                <input
                  onChange={(e) => setNewMessages(e.target.value)}
                  value={newMessage}
                  className="new-message-input"
                  placeholder="Type your message here"
                />
                <button className="new-message-button" type="submit">Send</button>
              </form>
            </div>
          );
}