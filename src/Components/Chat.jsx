import React from 'react'
import Messages from './messages'
import Input from './Input'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>Jane</span>
        <div className="chatIcons">
            <img src="https://img.icons8.com/?size=100&id=24445&format=png&color=000000" alt="" />
            <img src="https://img.icons8.com/?size=100&id=UkLBG0sZoWV0&format=png&color=000000" alt="" />
            <img src="https://img.icons8.com/?size=100&id=61873&format=png&color=000000" alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat