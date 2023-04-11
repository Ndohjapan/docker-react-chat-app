import React, { useContext, useEffect} from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import DisplaySideBar from "./DisplaySideBar";

function SideBarUsers({ currentMessages, setSideBarUsers, sideBarUsers }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


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
      setSideBarUsers(body);
      return body;
    };
    currentUser.uid && getChats() 
  }, [currentUser.uid, data.selectedUser, currentMessages, setSideBarUsers]);

  return (
    <DisplaySideBar sideBarUsers={sideBarUsers}/>
  )
}

export default SideBarUsers;
