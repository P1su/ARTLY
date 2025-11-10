import styles from './Menu.module.css';
import { useContext } from 'react';
import { UserContext } from '../../store/UserProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { menuList } from '../../utils/menu.js';

export default function Menu({ onOpen, isOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    onOpen();
    navigate('/');
  };

  const handleNavigate = (path) => {
    onOpen();
    navigate(path);
  };

  console.log(user);

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.menuLayout} ${isOpen ? styles.menuVisible : styles.menuHidden}`}
      >
        {/* 닫기 버튼 */}
        <div className={styles.closeContainer}>
          <button className={styles.closeButton} onClick={onOpen} />
        </div>

        {/* 유저 정보 */}
        <section className={styles.menuSection}>
          <h3 className={styles.userNickname}>
            {user ? `${user.user_name} 님` : '로그인 해주세요'}
          </h3>

          {/* 관리자 메뉴 */}
          <div className={styles.sidebarMenu}>
            {user && user.admin_flag && (
              <span
                className={styles.menuSpan}
                onClick={() => {
                  handleNavigate('/console/main');
                }}
              >
                갤러리 관리
              </span>
            )}
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 기본 메뉴 */}
        <section className={styles.menuSection}>
          <div className={styles.sidebarMenu}>
            {menuList.map(({ name, label, path }) => (
              <span
                className={styles.menuSpan}
                key={name}
                onClick={() => handleNavigate(path)}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 기타 메뉴 */}
        <section className={styles.menuSection}>
          <div className={styles.sidebarMenu}>
            <span
              className={styles.menuSpan}
              onClick={() => handleNavigate('/scan')}
            >
              도슨트 듣기
            </span>
            <span
              className={styles.menuSpan}
              onClick={() => alert('도록 페이지 이동')}
            >
              디지털 도록
            </span>
            <span
              className={styles.menuSpan}
              onClick={() => handleNavigate('/nearby-galleries')}
            >
              갤러리 찾기
            </span>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 하단 메뉴 */}
        <section className={styles.menuSection}>
          <div className={styles.sidebarMenu}>
            <span
              className={styles.menuSpan}
              onClick={() => handleNavigate('/mypage')}
            >
              마이페이지
            </span>
            <span
              className={styles.menuSpan}
              onClick={() => handleNavigate('/announcement')}
            >
              공지사항 & FAQ
            </span>
            {localStorage.getItem('ACCESS_TOKEN') ? (
              <span className={styles.menuSpan} onClick={handleLogout}>
                로그아웃
              </span>
            ) : (
              <span
                className={styles.menuSpan}
                onClick={() => handleNavigate('/login')}
              >
                로그인
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
