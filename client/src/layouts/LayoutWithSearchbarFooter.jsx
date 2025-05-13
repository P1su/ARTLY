import { Outlet } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Footer from '../components/Footer/Footer';

export default function LayoutWithSearchbarFooter() {
  return (
    <>
      <SearchBar />
      <Outlet />
      <Footer />
    </>
  );
}
