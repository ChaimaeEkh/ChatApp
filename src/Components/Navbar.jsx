import React, {useContext} from 'react';
import {signOut} from 'firebase/auth';
import {AuthContext} from '../context/AuthContext';
import {auth} from '../firebase';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='navbar'>
      <span className='logo'>Shemy Chat</span>
      <div className='user'>
        <img src={currentUser.avatar} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={()=> signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
