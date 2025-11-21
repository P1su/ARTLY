import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../store/UserProvider.jsx';
import Footer from './../components/Footer/Footer';

export default function AuthRoute() {
  const { user } = useContext(UserContext);

  if (!user || !user.id) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
