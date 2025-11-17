import { Outlet, Navigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

export default function AuthRoute() {
  return localStorage.getItem('ACCESS_TOKEN') ? (
    <>
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to='/login' replace />
  );
}
