import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();
  const [senderData, setSenderData] = useState(null);
  const [receiverData, setReceiverData] = useState(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const fetchSenderData = async () => {
      if (!message.senderId) return;
      
      try {
        const userDocRef = doc(db, "users", message.senderId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setSenderData(userDocSnap.data());
        } else {
          // Sif not found, try with email or displayName
          const q = query(
            collection(db, "users"), 
            where("uid", "==", message.senderId)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setSenderData(querySnapshot.docs[0].data());
          }
        }
      } catch (error) {
        console.error("Error while retrieving sender data.:", error);
      }
    };

    // function for fetching receiver data
    const fetchReceiverData = async () => {
      if (!data.user.uid) return;
      
      try {
        // Search with UID
        const userDocRef = doc(db, "users", data.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setReceiverData(userDocSnap.data());
        } else {
          const q = query(
            collection(db, "users"), 
            where("uid", "==", data.user.uid)
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setReceiverData(querySnapshot.docs[0].data());
          }
        }
      } catch (error) {
        console.error("Error while retrieving sender data.:", error);
      }
    };

    fetchSenderData();
    fetchReceiverData();
  }, [message.senderId, data.user.uid]);

  // Avatars with fallback
  const senderAvatar = senderData?.avatar || currentUser?.photoURL || "https://via.placeholder.com/40";
  const receiverAvatar = receiverData?.avatar || data.user?.photoURL || "https://via.placeholder.com/40";

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? senderAvatar : receiverAvatar}
          alt=""
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/40";
          }}
        />
        <span>
        {message.date?.seconds
          ? new Date(message.date.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </span>

      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;