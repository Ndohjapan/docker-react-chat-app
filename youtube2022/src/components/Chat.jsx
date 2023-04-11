import React, { useContext } from 'react'
import Cam from "../img/cam.png"
import Add from "../img/add.png"
import More from "../img/more.png"
import Messages from "./Messages"
import Input from "./Input"
import { ChatContext } from '../context/ChatContext'

function Chat({socket, currentMessages, setCurrentMessages}) {

  const { data  } = useContext(ChatContext);
  return (
    <div className='chat'>
        <div className="chatInfo">
            <span>{data.user?.displayName}</span>
            <div className="chatIcons">
                <img src={Cam} alt="" />
                <img src={Add} alt="" />
                <img src={More} alt="" />
            </div>
        </div>
        <Messages currentMessages={currentMessages} setCurrentMessages={setCurrentMessages} />
        <Input socket={socket} currentMessages={currentMessages}  setCurrentMessages={setCurrentMessages}  />
    </div>
  )
}

export default Chat