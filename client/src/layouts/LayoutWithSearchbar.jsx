import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar/SearchBar';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

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
