import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Menu from '../Menu/Menu';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <header className={styles.headerLayout}>
      <h1 className={styles.logoBox}>
        <Link to='/' className={styles.logoLink}>
          Artly
        </Link>
      </h1>
      <button onClick={isOpen ? handleClose : handleOpen}>
        {isOpen ? '닫기' : '메뉴'}
      </button>
      {isOpen && <Menu onOpen={handleClose} />}
    </header>
  );
}
