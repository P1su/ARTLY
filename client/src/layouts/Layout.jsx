import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import ChatbotWidget from '../components/common/ChatbotWidget/ChatbotWidget';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

export default function Layout() {
  useMobile();

  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <ChatbotWidget />
    </>
  );
}
