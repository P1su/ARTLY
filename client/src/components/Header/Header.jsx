import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.headerLayout}>
      <h1 className={styles.logoBox}>
        <Link to='/' className={styles.logoLink}>
          Artly
        </Link>
      </h1>
      <button onClick={handleOpen}>메뉴</button>
      {isOpen && <div>하...</div>}
    </header>
  );
}
