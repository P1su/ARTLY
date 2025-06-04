import useMobile from '../hooks/useMobile';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';
import ChatbotWidget from '../components/ChatbotWidget/ChatbotWidget';

export default function Layout() {
  useMobile();
  const location = useLocation();

  const excludedPaths = ['/login', '/register', '/mypage', '/mypage/edit'];
  const showChatbot = !excludedPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      <ScrollToTop />
      <Header />
      <NavBar />
      <Outlet />
      {showChatbot && <ChatbotWidget />}

      <Footer />
    </>
  );
}
