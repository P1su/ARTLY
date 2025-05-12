import { Outlet } from 'react-router-dom';
import ChatbotWidget from '../components/ChatbotWidget/ChatbotWidget';

export default function LayoutWithChatbot() {
  return (
    <>
      <Outlet />
      <ChatbotWidget />
    </>
  );
}
