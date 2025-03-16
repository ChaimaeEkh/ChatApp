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
      if (!currentUser) return;
      
      try {
        // search by email
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
          
          // Fallback with UID
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
        console.error("Error while retrieving sender user data.:", error);
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

  return (
    <div className='navbar'>
      <span className='logo'>Shemy Chat</span>
      <div className='user'>
        {userData ? (
          <>
            <img
              src={userData.avatar || currentUser?.photoURL || "https://via.placeholder.com/30"}
              alt="Avatar"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onError={(e) => {
                console.log("Image loading error");
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/30";
              }}
            />
            <span>{userData.displayName || currentUser?.displayName || "User"}</span>
          </>
        ) : currentUser ? (
          <>
            <img
              src={currentUser.photoURL || "https://via.placeholder.com/30"}
              alt="Avatar"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/30";
              }}
            />
            <span>{currentUser.displayName || currentUser.email || "User"}</span>
          </>
        ) : (
          <span>Not connected</span>
        )}
        
        {currentUser && (
          <button onClick={handleSignOut}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;