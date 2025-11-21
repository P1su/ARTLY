import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../store/UserProvider.jsx';
import Footer from './../components/Footer/Footer';

export default function AuthRoute() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user || !user.id) {
    return <Navigate to='/login' replace />;
  }

  const showFooter = location.pathname !== '/notifications';

  return (
    <>
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
}
