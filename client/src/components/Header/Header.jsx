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
      <span className={styles.logoSpan} onClick={handleHome}>
        Artly
      </span>
      <div className={styles.rightSection}>
        <img
          src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO2VOxLFIAwDff9L6zXJK2jAWOYTa2fomBEbGWImhPCCyXVcHr4mMkq73xsczasngs7B2CJw5kkEk42wGsXuRq4TaZGIkRuJ7qeNyin/kW0icK6oyGzecpGsvDS2BZcUwcKVSkmRF4kwYYzG6ue8poiRgkqIYFBUIiA2EmnpeCCRhuzLF7ngKC0ySpZImM+KoBPUC2aNEqKjJZEH7xfFbY1IxKo30oP2XD5IpCXtXd/VCG4XEULYnx+qft9LsKtc1gAAAABJRU5ErkJggg=='
          alt='qr-code'
          className={styles.qrCode}
          onClick={() => navigate('/scan')}
        />
        <button
          className={isOpen ? styles.menuOpen : styles.menuClosed}
          onClick={isOpen ? handleClose : handleOpen}
        >
          <span className={styles.menuSpan} />
          <span className={styles.menuSpan} />
          <span className={styles.menuSpan} />
        </button>
      </div>

      {isOpen && <Menu onOpen={handleClose} />}
    </header>
  );
}
