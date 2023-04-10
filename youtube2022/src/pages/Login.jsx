import React, { useContext, useState } from "react";
import Add from "../img/addAvatar.png";
import { useNavigate, Link } from "react-router-dom";
import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { err, setErr } = useState(false);
  const navigate = useNavigate();
  const {currentUser} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const letter = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('currentUser', JSON.stringify({uid: currentUser.uid, displayName: currentUser.displayName}))
      navigate('/')
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form  onSubmit={handleSubmit}>
          <input type="email" name="" id="" placeholder="email" />
          <input type="password" name="" id="" placeholder="password" />
          <button>Login</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
