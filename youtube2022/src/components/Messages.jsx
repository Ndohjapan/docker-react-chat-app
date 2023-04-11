import React, { useContext, useEffect} from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";

function Messages({ currentMessages, setCurrentMessages }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch(`/message/${data.chatId}/${currentUser.uid}`, {
        method: "GET",
        redirect: "follow",
      });

      const body = await response.json();
      if (response.status !== 200) {
        throw Error(body.message);
      }
      setCurrentMessages(body.messages);
      dispatch({
        type: "SET_SELECTED_USER",
        payload: Math.random().toString(36).substring(2, 15),
      });
      return body;
    };
    getMessages();
  }, [currentUser.uid, data.chatId, dispatch, setCurrentMessages]);


  return (
    <div className="messages">
      {currentMessages?.map((m) => (
        <Message message={m} key={uuid()} />
      ))}
    </div>
  );
}

export default Messages;
