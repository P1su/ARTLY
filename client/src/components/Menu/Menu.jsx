import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { menuList } from '../../utils/menu.js';

export default function Menu() {
  const nickname = '필수';

  // localStorage 로그인 토큰 여부로 변경 예정
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.menuLayout}>
      <section className={styles.menuSection}>
        {isLogin ? (
          <span
            className={styles.userInfoSpan}
          >{`${nickname}님 안녕하세요`}</span>
        ) : (
          <span className={styles.mutedSpan} onClick={handleLogin}>
            로그인 해주세요
          </span>
        )}
        <nav>
          <ul>
            {menuList.map(({ name, label, path }) => (
              <MenuItem key={name} label={label} path={path} />
            ))}
          </ul>
        </nav>
      </section>
      <footer className={styles.menuFooter}>
        {isLogin ? (
          <span onClick={handleLogin}>로그아웃</span>
        ) : (
          <>
            <Link to='/login'>로그인</Link>
            <span className={styles.mutedSpan}> | </span>
            <Link to='/register'>회원가입</Link>
          </>
        )}
      </footer>
    </div>
  );
}

function MenuItem({ label, path }) {
  return (
    <div className={styles.menuItemLayout}>
      <span>{label}</span>
      <Link to={path}>&gt;</Link>
    </div>
  );
}
