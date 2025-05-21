import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Menu from '../Menu/Menu';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
      <h1 className={styles.logoBox}>
        <span onClick={handleHome}>Artly</span>
      </h1>
      <div className={styles.rightSection}>
        <img
          src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO2VOxLFIAwDff9L6zXJK2jAWOYTa2fomBEbGWImhPCCyXVcHr4mMkq73xsczasngs7B2CJw5kkEk42wGsXuRq4TaZGIkRuJ7qeNyin/kW0icK6oyGzecpGsvDS2BZcUwcKVSkmRF4kwYYzG6ue8poiRgkqIYFBUIiA2EmnpeCCRhuzLF7ngKC0ySpZImM+KoBPUC2aNEqKjJZEH7xfFbY1IxKo30oP2XD5IpCXtXd/VCG4XEULYnx+qft9LsKtc1gAAAABJRU5ErkJggg=='
          alt='qr-code'
          className={styles.qrCode}
          onClick={() => navigate('/scan')}
        />
        <button
          className={styles.menu}
          onClick={isOpen ? handleClose : handleOpen}
        >
          {isOpen ? '닫기' : '메뉴'}
        </button>
      </div>

      {isOpen && <Menu onOpen={handleClose} />}
    </header>
  );
}
