import React, { useContext } from 'react'
import Messages from './messages'
import Input from './Input'
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.users?.displayName}</span>
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