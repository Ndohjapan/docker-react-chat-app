import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

async function saveToDB(uid, displayName, email, photoURL) {  
  // Save data in the database
  const response = await fetch("/api/api/1.0/auth/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      displayName,
      email,
      photoURL,
    }),
  });
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

function Register() {
  const { err, setErr } = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  localStorage.setItem("messagingUser", "")

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if(!file){
      setIsLoading(false);
      return alert('Select an image')
    }

    else{
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
  
        const storageRef = ref(storage, displayName);
  
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          (error) => {
            setErr(true);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log("File available at", downloadURL);
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
  
              try {
                await saveToDB(res.user.uid, displayName, email, downloadURL);
                setIsLoading(false);
                navigate("/");
              } catch (error) {
                console.log(error);
                setIsLoading(false);
                setErr(true);
              }
            });
          }
        );
      } catch (error) {
        setIsLoading(false);
        setErr(true);
      }
      
    }


  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Docker Chats</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="" id="" placeholder="display name" />
          <input type="email" name="" id="" placeholder="email" />
          <input type="password" name="" id="" placeholder="password" />
          <input type="file" name="" id="file" style={{ display: "none" }} />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : (
            "Sign Up"
          )}
        </button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
