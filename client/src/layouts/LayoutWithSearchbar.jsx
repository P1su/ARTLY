import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar/SearchBar';

export default function LayoutWithSearchbar() {
  useMobile();

  return (
    <>
      <SearchBar />
      <Outlet />
    </>
  );
}
