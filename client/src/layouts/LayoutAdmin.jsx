import useMobile from '../hooks/useMobile';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';

export default function LayoutAdmin() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </>
  );
}
