import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../firebase";
import { FaSpinner } from "react-icons/fa";

function Login() {
  const { err, setErr } = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const login = await signInWithEmailAndPassword(auth, email, password)
      localStorage.setItem('currentUser', JSON.stringify({uid: login.user.uid, displayName: login.user.displayName}))
      setIsLoading(false);
      navigate('/')
    } catch (error) {
      alert('Invalid Password/Email')
      setIsLoading(false);
      setErr(true);
    }

  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Docker Chat</span>
        <span className="title">Register</span>
        <form  onSubmit={handleSubmit}>
          <input type="email" name="" id="" placeholder="email" />
          <input type="password" name="" id="" placeholder="password" />
          <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : (
            "Login"
          )}
        </button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? <Link to='/register'>Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
