import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Header.module.css';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setNickname('아뜰리');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname('');
    setIsMenuOpen(false);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.headerLayout}>
      <h1 className={styles.logoBox}>
        <Link to="/" className={styles.logoLink}>Artly</Link>
      </h1>

      <div className={styles.userContainer}>
        {isLoggedIn ? (
          <>
            <div className={styles.nicknameWrapper} onClick={handleToggleMenu}>
              <span>
                <span className={styles.nicknameText}>{nickname}</span>
                <span className={styles.nicknameSuffix}> 님</span>
              </span>
              <span className={styles.dropdownSpan}>▼</span>
            </div>

            <button type="button" className={styles.pageButton}>
              마이페이지
            </button>

            {isMenuOpen && (
              <div className={styles.dropdownBox}>
                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button type="button" className={styles.authButton} onClick={handleLogin}>
              로그인
            </button>
            <button type="button" className={styles.authButton}>
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
