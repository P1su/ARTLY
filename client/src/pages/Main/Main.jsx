import styles from './Main.module.css';
import MainCarousel from './components/MainCarousel/MainCarousel';
import ArtistCarousel from './components/ArtistCarousel/ArtistCarousel';
import SwipeCarousel from './components/SwipeCarousel/SwipeCarousel';
import MobileMain from './components/MobileMain/MobileMain';
import useResponsive from '../../hooks/useResponsive';
import Footer from '../../components/Footer/Footer';
import { FaChevronRight } from 'react-icons/fa';
import IcDocent from '../../assets/svg/IcDocent';
import IcBook from '../../assets/svg/IcBook';
import IcFindGallery from '../../assets/svg/IcFindGallery';
import { useUser } from '../../store/UserProvider';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const { isMobile } = useResponsive();
  const { user } = useUser();
  const navigate = useNavigate();

  const tabItems = [
    {
      key: 'docent',
      icon: <IcDocent />,
      label: '도슨트 듣기',
      link: '/scan',
    },
    {
      key: 'book',
      icon: <IcBook />,
      label: '디지털 도록',
      link: '/mypage',
    },
    {
      key: 'find-gallery',
      icon: <IcFindGallery />,
      label: '갤러리 찾기',
      link: '/nearby-galleries',
    },
  ];
  return (
    <>
      <div className={styles.mainLayout}>
        {isMobile ? (
          <MobileMain />
        ) : (
          <>
            <MainCarousel />
            <div className={styles.tabContainer}>
              <div
                className={styles.userText}
                onClick={!user ? () => navigate('/login') : undefined}
                style={
                  !user
                    ? {
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }
                    : {}
                }
              >
                {!user ? (
                  <>
                    로그인해주세요 <FaChevronRight size={20} />
                  </>
                ) : (
                  `${user.user_name}님, 반갑습니다.`
                )}
              </div>

              <div className={styles.itemContainer}>
                {tabItems.map(({ key, icon, label, link }) => (
                  <div
                    className={styles.itemBox}
                    key={key}
                    onClick={() => {
                      key === 'book'
                        ? navigate(link, { state: { activeTab: 'MY도록' } })
                        : navigate(link);
                    }}
                  >
                    <span className={styles.itemIcon}>{icon}</span>
                    <span className={styles.itemLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.carouselContainer}>
              <SwipeCarousel title='| 현재 진행 중인 전시' />
              <SwipeCarousel
                title='| 인기있는 전시'
                category='sort'
                value='popular'
              />
              <ArtistCarousel title='| 전시 중인 작가' />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
