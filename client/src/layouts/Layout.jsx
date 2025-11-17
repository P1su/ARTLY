import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import ChatbotWidget from '../components/ChatbotWidget/ChatbotWidget';

export default function Layout() {
  const location = useLocation();

  const excludedPaths = ['/login', '/register', '/mypage', '/mypage/edit'];
  const showChatbot = !excludedPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      <ScrollToTop />
      <Header />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </div>
      {showChatbot && <ChatbotWidget />}
    </>
  );
}
