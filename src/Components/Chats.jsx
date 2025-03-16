import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser?.uid) {
      console.warn("Aucun utilisateur connecté. Annulation de la récupération des chats.");
      return;
    }

    const getChats = () => {
      const userChatRef = doc(db, "userChats", currentUser.uid);

      const unsub = onSnapshot(userChatRef, (docSnap) => {
        if (docSnap.exists()) {
          console.log("Firestore userChats data:", docSnap.data()); // Debug Firestore
          setChats(Object.entries(docSnap.data() || {}));
        } else {
          console.warn("Aucune donnée trouvée dans userChats.");
          setChats([]);
        }
      }, (error) => {
        console.error("Erreur lors de la récupération des chats :", error);
      });

      return () => unsub();
    };

    getChats();
  }, [currentUser?.uid]);

  console.log("Chats state:", chats); // Debug : Vérification des données dans le state

  const handleSelect = (user) => {
    if (!user) {
      console.warn("Impossible de sélectionner un utilisateur: userInfo est undefined.");
      return;
    }
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chats.length === 0 && <p>Aucun chat disponible</p>}
      {chats
        .sort((a, b) => (b[1]?.date || 0) - (a[1]?.date || 0))
        .map(([chatId, chat]) => {
          if (!chat?.userInfo) {
            console.warn(`chat.userInfo est undefined pour le chatID: ${chatId}`);
            return null;
          }

          return (
            <div
              className="userChat"
              key={chatId}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <img
                src={chat.userInfo.avatar || "https://via.placeholder.com/150"}
                alt="avatar"
                onError={(e) => {
                  console.error("Image loading error:", e.target.src);
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="userChatInfo">
                <span>{chat.userInfo.displayName || "Utilisateur inconnu"}</span>
                <p>{chat.lastMessage?.text || "Aucun message"}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
