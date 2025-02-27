import React from 'react'

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className='logo'>Shemy Chat</span>
      <div className='user'>
        <img src="https://i.pinimg.com/736x/c3/67/bc/c367bc14c5ecda4532d254a9e368108a.jpg" alt="" />
        <span>John</span>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
