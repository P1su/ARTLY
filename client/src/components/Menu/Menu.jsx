import styles from './Menu.module.css';
import { useContext } from 'react';
import { UserContext } from '../../store/UserProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { menuList } from '../../utils/menu.js';
import useModal from '../../hooks/useModal.jsx';
import LogoutModal from './LogoutModal/LogoutModal.jsx';

export default function Menu({ onOpen, isOpen }) {
  const navigate = useNavigate();
  const { isOpen: isModalOpen, handleOpenModal } = useModal();
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    handleOpenModal();
    //onOpen();
    //navigate('/');
  };

  const handleCloseModal = () => {
    handleOpenModal();
    onOpen();
    navigate('/');
  };

  const handleNavigate = (path) => {
    onOpen();
    navigate(path);
  };

  return (
    <div className={styles.overlay} onClick={onOpen}>
      {isModalOpen && <LogoutModal onClose={handleCloseModal} />}
      <div
        className={`${styles.menuLayout} ${isOpen ? styles.menuVisible : styles.menuHidden}`}
        onClick={(e) => e.stopPropagation()}
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
          {user && user.admin_flag === '1' && (
            <div className={styles.sidebarMenu}>
              <span
                className={styles.menuSpan}
                onClick={() => handleNavigate('/console/main')}
              >
                갤러리 관리
              </span>
            </div>
          )}
        </section>

        <hr className={styles.divider} />

        {/* 기본 메뉴 */}
        <section className={styles.menuSection}>
          {menuList.map(({ name, label, path }) => (
            <span
              className={styles.menuSpan}
              key={name}
              onClick={() => handleNavigate(path)}
            >
              {label}
            </span>
          ))}
        </section>

        <hr className={styles.divider} />

        {/* 기타 메뉴 */}
        <section className={styles.menuSection}>
          <span
            className={styles.menuSpan}
            onClick={() => handleNavigate('/scan')}
          >
            도슨트 듣기
          </span>
          <span
            className={styles.menuSpan}
            onClick={() => {
              handleNavigate('/mypage');
            }}
          >
            디지털 도록
          </span>
          <span
            className={styles.menuSpan}
            onClick={() => handleNavigate('/nearby-galleries')}
          >
            갤러리 찾기
          </span>
        </section>

        <hr className={styles.divider} />

        {/* 하단 메뉴 */}
        <section className={styles.menuSection}>
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
          {user ? (
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
        </section>
      </div>
    </div>
  );
}
