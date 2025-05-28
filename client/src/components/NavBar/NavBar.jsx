import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function NavBar() {
  const menuList = [
    { label: 'EXHIBITION', path: '/exhibitions' },
    { label: 'NEWS', path: '/notices' },
    { label: 'ART', path: '/nearby-galleriess' },
    { label: 'ARTIST', path: '/artists' },
    { label: 'GALLERY', path: '/galleries' },
  ];

  const { pathname } = useLocation();

  return (
    <nav className={styles.navbarNavigation}>
      <ul className={styles.menuList}>
        {menuList.map(({ label, path }) => (
          <li
            key={path}
            className={`${styles.menuItem} ${pathname === path && styles.currentMenu}`}
          >
            <NavLink
              to={path}
              className={({ isActive }) => isActive && styles.activeLink}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
