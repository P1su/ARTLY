import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import SearchBar from '../components/common/SearchBar/SearchBar';
import ChatbotWidget from '../components/common/ChatbotWidget/ChatbotWidget';

export default function LayoutWithSearchbar() {
  useMobile();

  return (
    <div style={{ position: 'relative' }}>
      <Header />
      <SearchBar />
      <Outlet />
      <ChatbotWidget />
    </div>
  );
}
