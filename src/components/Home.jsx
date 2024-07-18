import React, { useEffect } from "react";
import NavBar from "./NavBar";
import "../styles/home.css";
import Dashboard from "./Dashboard";
import socket, { connectSocket, disconnectSockets } from "../socket";
import { useSelector } from "react-redux";

const Home = ({ children }) => {
  const { loggedInUser } = useSelector((state) => state.login);
  useEffect(() => {
    connectSocket()
    return () => {
      disconnectSockets()
    };
  }, []);

   useEffect(() => {
    if(loggedInUser?.id || loggedInUser?._id){
      socket.emit('setUserId', loggedInUser.id || loggedInUser._id)
    }
   }, [loggedInUser])
  return (
    <div className="home-page">
      <NavBar />
      <Dashboard>{children}</Dashboard>
    </div>
  );
};

export default Home;
