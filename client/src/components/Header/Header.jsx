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
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleHome = () => {
    handleClose();
    navigate('/');
  };

  const handleNotificationClick = () => {
    handleClose();

    if (user && user.admin_flag === '1') {
      navigate('/console/notification');  
    } else {
      navigate('/notifications');          
    }
  };

  return (
    <header className={styles.headerLayout}>
      <span className={styles.logoSpan} onClick={handleHome}>
        ARTLY
      </span>

      {isDesktop && <NavBar />}

      <div className={styles.rightSection}>
        {/* 알림 버튼 */}
        <button
          className={styles.notificationButton}
          onClick={handleNotificationClick}
          aria-label="알림"
        >
          <IcBell />
        </button>

        {/* 메뉴 버튼 */}
        <button onClick={isOpen ? handleClose : handleOpen}>
          <IcMenu />
        </button>
      </div>

      {isOpen && <Menu onOpen={handleClose} isOpen={isOpen} />}
    </header>
  );
}