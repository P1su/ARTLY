import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../store/UserProvider.jsx';

export default function AuthRoute() {
  
  const { user } = useContext(UserContext); 

  if (!user || !user.id) { 
    return (
      <Navigate to='/login' replace={true} />
    );
  }

  return <Outlet />; 
}