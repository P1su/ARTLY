import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import SearchBar from '../components/SearchBar/SearchBar';

export default function LayoutWithSearchbar() {
  useMobile();

  return (
    <>
      <ScrollToTop />
      <SearchBar />
      <Outlet />
    </>
  );
}
