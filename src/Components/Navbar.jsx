import React, { useContext, useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../firebase';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchUserByEmail = async () => {
      if (!currentUser || !currentUser.email) {
        console.warn("currentUser or email is undefined, skipping fetch.");
        return;
      }
  
      try {
        const q = query(
          collection(db, "users"),
          where("email", "==", currentUser.email)
        );
  
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          console.log("User found by email:", userDoc.data());
          setUserData(userDoc.data());
        } else {
          console.log("No user found with this email:", currentUser.email);
  
          // Recherche par UID
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            console.log("User document found by UID:", userDocSnap.data());
            setUserData(userDocSnap.data());
          } else {
            console.log("No user document found for UID:", currentUser.uid);
          }
        }
      } catch (error) {
        console.error("Error while retrieving user data:", error);
      }
    };
  
    fetchUserByEmail();
  }, [currentUser]);
  
  console.log("État actuel - currentUser:", currentUser);
  console.log("État actuel - userData:", userData);

  const handleSignOut = () => {
    try {
      signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Définir une image par défaut si l'avatar est vide ou invalide
  const getValidAvatar = () => {
    if (userData?.avatar) return userData.avatar;
    if (currentUser?.photoURL) return currentUser.photoURL;
    return "https://via.placeholder.com/30";
  };

  return (
    <div className='navbar'>
      <span className='logo'>Shemy Chat</span>
      <div className='user'>
        {currentUser && (
          <>
            <img
              src={getValidAvatar()}
              alt="Avatar"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onError={(e) => {
                console.error("Image loading error:", e.target.src);
                e.target.onerror = null; // Empêche la boucle infinie
                e.target.src = "https://via.placeholder.com/30";
              }}
            />
            <span>{userData?.displayName || currentUser?.displayName || currentUser.email || "User"}</span>
            <button onClick={handleSignOut}>Logout</button>
          </>
        )}
        
        {!currentUser && <span>Not connected</span>}
      </div>
    </div>
  );
};

export default Navbar;
