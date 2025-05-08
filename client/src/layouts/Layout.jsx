import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import ChatbotWidget from '../components/ChatbotWidget/ChatbotWidget';

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
