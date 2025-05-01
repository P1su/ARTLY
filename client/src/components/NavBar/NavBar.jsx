import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar() {
  const menuList = [
    { label: '전시회', path: '/exhibitions' },
    { label: '갤러리', path: '/galleries' },
    { label: '작가', path: '/artists' },
    { label: '주변 갤러리', path: '/nearby-galleries' },
    { label: '공고', path: '/notices' },
  ];

  return (
    <nav className={styles.navbarNavigation}>
      <ul className={styles.menuList}>
        {menuList.map(({ label, path }) => (
          <li key={path} className={styles.menuItem}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.defaultLink
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
