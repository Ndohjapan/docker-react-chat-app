import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [socketIO, setSocketIO] = useState([])
  const [currentMessages, setCurrentMessages ] = useState([])
  const [messagingUser, setMessagingUser ] = useState([])

  // useEffect(() => {
  //   const socket = io("http://localhost:3000", {
  //     auth: {
  //       uid: currentUser.uid,
  //       displayName: currentUser.displayName
  //     },
  //   });

    // socket.on('newMessage', data => {
    //   let currentChattingUser = (JSON.parse(localStorage.getItem('messagingUser')))

    //   if(currentChattingUser.uid === data.from){
    //     console.log('This message is for the current user I am chatting therefor I will rerender the message screen')
    //     setCurrentMessages([
    //       ...currentMessages,
    //       data,
    //     ]);
    //   }

    //   else{
    //     console.log('It is just an alert, so rerender the sidebar')
    //   }
    // })

  //   setSocketIO(socket)
  // }, [currentMessages, currentUser.displayName, currentUser.uid]);
  
  return (

    <div className="home">
      <div className="container">
        <Sidebar setMessagingUser={setMessagingUser} currentMessages={currentMessages}/>
        <Chat socketIO={socketIO} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages}/>
      </div>
    </div>
  );
}

export default Home;
