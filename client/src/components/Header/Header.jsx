import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header({ isLoggedIn, nickname, onLogin, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.headerLayout}>
      <h1 className={styles.logoBox}>
        <Link to="/">Artly</Link>
      </h1>

      <div className={styles.userContainer}>
        {isLoggedIn ? (
          <>
            <div
              className={styles.nicknameWrapper}
              onClick={handleToggleMenu}
            >
              <span>
                <span className={styles.nicknameText}>{nickname}</span>
                <span className={styles.nicknameSuffix}> 님</span>
              </span>
              <span className={styles.dropdownSpan}>▼</span>
            </div>

            <button
              type="button"
              className={styles.pageButton}
            >
              마이페이지
            </button>

            {isMenuOpen && (
              <div className={styles.dropdownBox}>
                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={onLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.authButton}
              onClick={onLogin}
            >
              로그인
            </button>

            <button
              type="button"
              className={styles.authButton}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
