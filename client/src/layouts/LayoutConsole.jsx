import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

export default function LayoutConsole() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}
