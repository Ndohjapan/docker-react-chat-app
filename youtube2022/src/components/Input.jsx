import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

function Input({ socket, currentMessages, setCurrentMessages }) {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { dispatch } = useContext(ChatContext);

  async function createMessage(message, url) {
    const response = await fetch("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        combinedId: [currentUser.uid, data.user.uid],
        text: message,
        url,
        from: currentUser.uid,
      }),
      redirect: "follow",
    });

    const body = await response.json();
    console.log(body.message);
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body.message;
  }

  const handleSend = async () => {
    let combinedId =
      currentUser.uid > data.user.uid
        ? currentUser.uid + data.user.uid
        : data.user.uid + currentUser.uid;
    let url = [];
    if (img) {
      url = [URL.createObjectURL(img)];
    }
    setCurrentMessages([
      ...currentMessages,
      { combinedId, from: currentUser.uid, text, url },
    ]);

    if (img) {
      const fileId = uuid();

      const storage = getStorage();
      const storageRef = ref(storage, fileId);

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case "paused":
              // eslint-disable-next-line no-unused-expressions
              "Upload is paused";
              break;
            case "running":
              // eslint-disable-next-line no-unused-expressions
              "Upload is running";
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            url = downloadURL;
            await createMessage(text, [downloadURL]);
            socket.emit("message", {
              displayName: data.user.displayName,
              from: currentUser.uid,
              uid: data.user.uid,
              message: {
                combinedId,
                from: currentUser.uid,
                text,
                url: [downloadURL],
                uid: data.user.uid,
              },
            });
          });
        }
      );
    } else {
      await createMessage(text, []);
      socket.emit("message", {
        displayName: data.user.displayName,
        from: currentUser.uid,
        uid: data.user.uid,
        message: {
          combinedId,
          from: currentUser.uid,
          text,
          url: [],
          uid: data.user.uid,
        },
      });
    }

    dispatch({
      type: "CHANGE_USER",
      payload: data.user,
    });


    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        name=""
        id=""
        placeholder="Type Something...."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          name=""
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Input;
