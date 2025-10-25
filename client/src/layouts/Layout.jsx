import useMobile from '../hooks/useMobile';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
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
      <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
        <Outlet />
      </div>
      {showChatbot && <ChatbotWidget />}

      <Footer />
    </>
  );
}
