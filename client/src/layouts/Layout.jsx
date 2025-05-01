import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import ChatbotWidget from '../components/common/ChatbotWidget/ChatbotWidget';

export default function Layout() {
  useMobile();

  return (
    <div style={{ position: 'relative' }}>
      <Header />
      <Outlet />
      <ChatbotWidget />
    </div>
  );
}
