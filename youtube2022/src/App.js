import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000');

function App() {
  // const [currentUser, setCurrentUser] = useState({});
  const { currentUser } = useContext(AuthContext);


  const ProtectedRoute = ({ children }) => {
    console.log(currentUser)
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    localStorage.setItem('currentUser', JSON.stringify({uid: currentUser.uid, displayName: currentUser.displayName}))
    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home socket={socket}/>
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
