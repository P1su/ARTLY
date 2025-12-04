import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../store/UserProvider.jsx';
import Footer from './../components/Footer/Footer';

export default function AuthRoute() {
  const { user, isLoading } = useContext(UserContext);
  const location = useLocation();

  // 로딩 중일 때는 리다이렉트하지 않음
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로딩이 완료되었는데 user가 없으면 로그인 페이지로 리다이렉트
  if (!user || !user.id) {
    return <Navigate to='/login' replace />;
  }

  const showFooter = location.pathname !== '/notifications';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '1' }}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
