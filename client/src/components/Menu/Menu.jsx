import styles from './Menu.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { menuList } from '../../utils/menu.js';

export default function Menu({ onOpen }) {
  const nickname = '필수';
  const navigate = useNavigate();

  // localStorage 로그인 토큰 여부로 변경 예정
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleNavigate = (path) => {
    onOpen();
    navigate(path);
  };

  return (
    <div className={styles.menuLayout}>
      <section className={styles.menuSection}>
        {isLogin ? (
          <div>
            <span className={styles.boldSpan}>{nickname}</span>님 안녕하세요
          </div>
        ) : (
          <span className={styles.mutedSpan} onClick={handleLogin}>
            로그인 해주세요
          </span>
        )}
        <nav>
          <ul>
            {menuList.map(({ name, label, path }) => (
              <MenuItem
                key={name}
                label={label}
                onNavigate={() => {
                  handleNavigate(path);
                }}
              />
            ))}
          </ul>
        </nav>
      </section>
      <footer className={styles.menuFooter}>
        {isLogin ? (
          <span className={styles.logoutSpan} onClick={handleLogin}>
            로그아웃
          </span>
        ) : (
          <>
            <span onClick={() => handleNavigate('/login')}>로그인</span>
            <span className={styles.mutedSpan}> | </span>
            <span onClick={() => handleNavigate('/register')}>회원가입</span>
          </>
        )}
      </footer>
    </div>
  );
}

function MenuItem({ label, onNavigate }) {
  return (
    <div className={styles.menuItemLayout} onClick={onNavigate}>
      <span>{label}</span>
      <span>&gt;</span>
    </div>
  );
}
