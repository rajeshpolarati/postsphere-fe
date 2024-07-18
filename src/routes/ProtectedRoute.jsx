import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const {isLoggedIn} = useSelector(state=> state.login)
  const {isLoading} = useSelector(state=> state.appearance)
  return isLoggedIn ? <Outlet/> : isLoading?.length ? <div></div> :<Navigate to="/login" />;
};

export default ProtectedRoute;
