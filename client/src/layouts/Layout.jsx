import useMobile from '../hooks/useMobile';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Header from '../components/Header/Header';
import NavBar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';

export default function Layout() {
  useMobile();

  return (
    <>
      <ScrollToTop />
      <Header />
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
