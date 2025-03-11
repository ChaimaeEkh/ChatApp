import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (!username.trim()) return;

    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0]?.data()); 
        setErr(false);
      } else {
        setUser(null);
        setErr(true);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };
//check whether the group (chats in firestore) exists, if not create
const handleSelect = async () => {
  if (!user) return;

  const combinedId =
    currentUser.uid > user.uid
      ? currentUser.uid + user.uid
      : user.uid + currentUser.uid;

  try {
    const chatRef = doc(db, "chats", combinedId);
    const res = await getDoc(chatRef);

    if (!res.exists()) {
      // Create a chat in the chats collection
      await setDoc(chatRef, { messages: [] });
    }

    // References for userChats documents
    const currentUserChatsRef = doc(db, "userChats", currentUser.uid);
    const selectedUserChatsRef = doc(db, "userChats", user.uid);

    // Check if userChats documents exist
    const currentUserChatsSnap = await getDoc(currentUserChatsRef);
    const selectedUserChatsSnap = await getDoc(selectedUserChatsRef);

    // Create userChats document if it doesn't exist for the current user
    if (!currentUserChatsSnap.exists()) {
      await setDoc(currentUserChatsRef, {}); // Create an empty document
    }

    // Create userChats document if it doesn't exist for the selected user
    if (!selectedUserChatsSnap.exists()) {
      await setDoc(selectedUserChatsRef, {}); // Create an empty document
    }

    // Update userChats with chat information
    await updateDoc(currentUserChatsRef, {
      [combinedId + ".userInfo"]: {
        uid: user.uid,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      [combinedId + ".date"]: serverTimestamp(),
    });

    await updateDoc(selectedUserChatsRef, {
      [combinedId + ".userInfo"]: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
      [combinedId + ".date"]: serverTimestamp(),
    });
    
  } catch (error) {
    console.error("Erreur lors de la sélection :", error);
  }

  setUser(null);
  setUsername("");
};


  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
          />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
