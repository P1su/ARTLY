import styles from './Header.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Menu from '../Menu/Menu';
import SearchBar from '../SearchBar/SearchBar';
import { FaQrcode, FaSearch } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
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
      {isSearch && (
        <SearchBar
          onClose={() => {
            setIsSearch((prev) => !prev);
          }}
        />
      )}
      <div className={styles.rightSection}>
        <FaSearch
          className={styles.icon}
          onClick={() => {
            setIsSearch((prev) => !prev);
          }}
        />
        <Link className={styles.qrCode} onClick={() => navigate('/scan')}>
          <FaQrcode className={styles.icon} />
        </Link>
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
