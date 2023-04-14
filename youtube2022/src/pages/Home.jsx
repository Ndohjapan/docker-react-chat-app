import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { AuthContext } from "../context/AuthContext";

function Home({ socket }) {
  const { currentUser } = useContext(AuthContext);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [sideBarUsers, setSideBarUsers] = useState([]);

  socket.emit("createRoom", {
    uid: currentUser.uid,
    displayName: currentUser.displayName,
  });

  useEffect(() => {
    socket.on("newMessage", (data) => {
      let currentChattingUser = JSON.parse(
        localStorage.getItem("messagingUser")
      );

      if (currentChattingUser.uid === data.from) {
        console.log(
          "This message is for the current user I am chatting therefor I will rerender the message screen"
        );
        setCurrentMessages([...currentMessages, data]);
      } else {
        console.log("This is from another user which I am not in their chat");
      }
      const getSideBarUsers = async (uid) => {
        const response = await fetch(`/api/userChat/${uid}`, {
          method: "GET",
          redirect: "follow",
        });
      
        const body = await response.json();
        if (response.status !== 200) {
          throw Error(body.message);
        }
        setSideBarUsers(body);
        return body;
      };
  
      getSideBarUsers(currentUser.uid)
    });

  }, [currentMessages, currentUser.displayName, currentUser.uid, socket]);

  return (
    <div className="home">
      <div className="container">
        <Sidebar
          currentMessages={currentMessages}
          setSideBarUsers={setSideBarUsers}
          sideBarUsers={sideBarUsers}
        />
        <Chat
          socket={socket}
          currentMessages={currentMessages}
          setCurrentMessages={setCurrentMessages}
        />
      </div>
    </div>
  );
}

export default Home;
