import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);


  async function searchForUser(displayName) {
    const response = await fetch(`/api/search?displayName=${displayName}`, {
      method: "GET",
      redirect: "follow",
    });

    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.user;
  }

  async function addToUserChat(uids) {
    const response = await fetch("/api/userChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uids),
      redirect: "follow"
    });

    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.user;
  }

  const handleSearch = async () => {
    try {
      const user = await searchForUser(username);
      localStorage.setItem('messagingUser', user)
      setUser(user);
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (e) => {
    try {
      // Call server to create a connection if there is none
      await addToUserChat({uids: [currentUser.uid, user.uid]})
      dispatch({ type: "CHANGE_USER", payload: e });
      
    } catch (error) {}
    setUser(null);
    setUsername("");
    // Create user chats
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          name=""
          id=""
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className="userChat" onClick={() => {handleSelect(user)}}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
