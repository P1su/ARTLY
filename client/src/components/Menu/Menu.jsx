import styles from './Menu.module.css';
import { useNavigate } from 'react-router-dom';
import { menuList } from '../../utils/menu.js';

export default function Menu({ onOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    onOpen();
    navigate('/');
  };

  const handleNavigate = (path) => {
    onOpen();
    navigate(path);
  };

  return (
    <div className={styles.menuLayout}>
      <section className={styles.menuSection}>
        <h3 className={styles.menuTitle}>메뉴</h3>
        <nav className={styles.menuNav}>
          {menuList.map(({ name, label, path }) => (
            <span
              className={styles.menuSpan}
              key={name}
              onClick={() => {
                handleNavigate(path);
              }}
            >
              {label}
            </span>
          ))}
        </nav>
      </section>
      <hr className={styles.divider} />
      <section className={styles.menuSection}>
        <nav className={styles.menuNav}>
          {localStorage.getItem('ACCESS_TOKEN') ? (
            <span className={styles.menuSpan} onClick={handleLogout}>
              LOGOUT
            </span>
          ) : (
            <span
              className={styles.menuSpan}
              onClick={() => handleNavigate('/login')}
            >
              LOGIN
            </span>
          )}
          <span
            className={styles.menuSpan}
            onClick={() => {
              handleNavigate('/mypage');
            }}
          >
            MYPAGE
          </span>
          <span
            className={styles.menuSpan}
            onClick={() => {
              handleNavigate('/notice');
            }}
          >
            NOTICE & FAQ
          </span>
        </nav>
      </section>
    </div>
  );
}
