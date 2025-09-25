import styles from './Header.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import Menu from '../Menu/Menu';
import NavBar from '../NavBar/NavBar';
import SearchBar from '../SearchBar/SearchBar';
import IcQR from '../../assets/svg/IcQR';
import IcMenu from '../../assets/svg/IcMenu';
import IcSearch from '../../assets/svg/IcSearch';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleHome = () => {
    handleClose();
    navigate('/');
  };

  return (
    <header className={styles.headerLayout}>
      <span className={styles.logoSpan} onClick={handleHome}>
        ARTLY
      </span>
      {isDesktop && <NavBar />}
      <div className={styles.rightSection}>
        {isSearch && (
          <SearchBar
            onClose={() => {
              setIsSearch((prev) => !prev);
            }}
          />
        )}
        <button
          onClick={() => {
            setIsSearch((prev) => !prev);
          }}
        >
          <IcSearch />
        </button>
        <Link className={styles.qrCode} onClick={() => navigate('/scan')}>
          <IcQR />
        </Link>
        <button onClick={isOpen ? handleClose : handleOpen}>
          <IcMenu />
        </button>
      </div>

      {isOpen && <Menu onOpen={handleClose} />}
    </header>
  );
}
