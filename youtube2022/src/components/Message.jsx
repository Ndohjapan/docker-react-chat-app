import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Message({ message }) {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'})
  }, [message])

  return (
    <div ref={ref} className={`message ${message.from === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={
            message.from === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.url[0] && <img src={message.url[0]} alt="" />}
      </div>
    </div>
  );
}

export default Message;
