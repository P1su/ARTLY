import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../store/UserProvider'; // 경로는 실제 위치에 맞춰주세요
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

export default function LayoutConsole() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  if (user.admin_flag === 1) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}
