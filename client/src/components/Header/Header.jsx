import styles from './Header.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useResponsive from '../../hooks/useResponsive';
import Menu from '../Menu/Menu';
import NavBar from '../NavBar/NavBar';
import IcQR from '../../assets/svg/IcQR';
import IcMenu from '../../assets/svg/IcMenu';
// import SearchBar from '../SearchBar/SearchBar';
// import IcSearch from '../../assets/svg/IcSearch';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // const [isSearch, setIsSearch] = useState(false);
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // 메뉴 열리면 스크롤 막기
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset'; // 메뉴 닫히면 스크롤 허용
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

      {/* 데스크탑에서는 NavBar 표시 */}
      {isDesktop && <NavBar />}

      <div className={styles.rightSection}>
        {/* QR 버튼 */}
        <Link className={styles.qrCode} onClick={() => navigate('/scan')}>
          <IcQR />
        </Link>

        {/* 메뉴 버튼 */}
        <button onClick={isOpen ? handleClose : handleOpen}>
          <IcMenu />
        </button>
      </div>

      {/* 메뉴 열기 */}
      {isOpen && <Menu onOpen={handleClose} isOpen={isOpen} />}
    </header>
  );
}
