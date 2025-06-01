import styles from './NavBar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { menuList } from '../../utils/menu.js';

export default function NavBar() {
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
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
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
