import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

export default function Layout() {
  useMobile();

  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
