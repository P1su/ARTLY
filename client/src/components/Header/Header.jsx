import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import useResponsive from '../../hooks/useResponsive';
import Menu from '../Menu/Menu';
import NavBar from '../NavBar/NavBar';
import IcMenu from '../../assets/svg/IcMenu';
import IcBell from './../../assets/svg/IcBell';
import { UserContext } from '../../store/UserProvider';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // 메뉴 열리면 스크롤 막기
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset'; // 메뉴 닫히면 스크롤 허용
  };

  const handleHome = () => {
    handleClose();
    navigate('/');
  };

  const handleBellClick = () => {
    if (user && user.admin_flag === '1') {
      // 관리자인 경우: 관심유저 관리 페이지로 이동
      navigate('/console/notification');
    } else {
      // 일반 사용자인 경우: 마이페이지로 이동 (알림 페이지가 생성되면 경로 변경 가능)
      navigate('/');
    }
  };

  return (
    <header className={styles.headerLayout}>
      <span className={styles.logoSpan} onClick={handleHome}>
        ARTLY
      </span>

      {/* 데스크탑에서는 NavBar 표시 */}
      {isDesktop && <NavBar />}

      <div className={styles.rightSection}>
        <div className={styles.bellButton} onClick={handleBellClick}>
          <IcBell />
        </div>

        {/* 메뉴 버튼 */}
        <button onClick={isOpen ? handleClose : handleOpen}>
          <IcMenu />
        </button>
      </div>

      {/* 메뉴 열기 */}
      {isOpen && <Menu onOpen={handleClose} isOpen={isOpen} />}
    </header>
  );
}
