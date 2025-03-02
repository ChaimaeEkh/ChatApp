import React from 'react'

const Input = () => {
  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' />
      <div className="send">
        <img src="https://img.icons8.com/?size=100&id=pB3lOOBeTps6&format=png&color=000000" alt="" />
        <input type="file" style={{display: "none"}} id='file' />
        <label htmlFor="file">
          <img src="https://img.icons8.com/?size=100&id=11550&format=png&color=000000" alt="" />
        </label>
        <button>Send</button>
      </div>
    </div>
  )
}

export default Input
