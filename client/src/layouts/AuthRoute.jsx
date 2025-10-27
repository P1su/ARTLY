import { Outlet, Navigate } from 'react-router-dom';

export default function AuthRoute() {
  return localStorage.getItem('ACCESS_TOKEN') ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace={true} />
  );
}
