import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { FaCircle } from "react-icons/fa";


function DisplaySideBar({sideBarUsers}){

    const { dispatch } = useContext(ChatContext);

    const handleSelect = (u) => {
        localStorage.setItem("messagingUser", JSON.stringify(u));
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <div className="chats">
          {Object.entries(sideBarUsers)[2]?.map((chat) => {
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
            return true
          })}
        </div>
      );
}

export default DisplaySideBar;
