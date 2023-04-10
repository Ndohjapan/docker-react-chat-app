import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { FaCoffee, FaCircle } from "react-icons/fa";
function Chats({ setMessagingUser, currentMessages }) {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const response = await fetch(`/userChat/${currentUser.uid}`, {
        method: "GET",
        redirect: "follow",
      });

      const body = await response.json();
      if (response.status !== 200) {
        throw Error(body.message);
      }
      setChats(body);
      return body;
    };
    currentUser.uid && getChats();
  }, [currentUser.uid, data.selectedUser, currentMessages]);

  const handleSelect = (u) => {
    localStorage.setItem("messagingUser", JSON.stringify(u));
    dispatch({ type: "CHANGE_USER", payload: u });
    setMessagingUser(u);
  };

  return (
    <div className="chats">
      {Object.entries(chats)[2]?.map((chat) => {
        if (typeof chat === "object") {
          return Object.entries(chat)
            ?.sort((a, b) => {
              // Convert the date strings to Date objects for comparison
              const dateA = new Date(a[1].date);
              const dateB = new Date(b[1].date);

              // Compare the two dates and return a value based on the comparison
              if (dateA > dateB) {
                // reversed comparison
                return -1;
              } else if (dateA < dateB) {
                // reversed comparison
                return 1;
              } else {
                return 0;
              }
            })
            .map((each) => (
              <div
                className="userChat"
                key={each[1].combinedId}
                onClick={() => {
                  handleSelect(each[1].userInfo);
                }}
              >
                <img src={each[1].userInfo.photoURL} alt="" />
                <div className="userChatInfo">
                  <span>{each[1].userInfo.displayName}</span>
                  <div className="lastMessage">
                    <p>{each[1].lastMessage?.text}</p>
                    <p className="icon-container">
                      {each[1].readLastMessage === false ? (
                        <FaCircle className="icon-notification" />
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            ));
        }
      })}
    </div>
  );
}

export default Chats;
