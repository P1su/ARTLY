import styles from './MobileMain.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa6';
import { instance, userInstance } from '../../../../apis/instance';
import { useUser } from '../../../../store/UserProvider';
import IcDocent from '../../../../assets/svg/IcDocent';
import IcBook from '../../../../assets/svg/IcBook';
import IcFindGallery from '../../../../assets/svg/IcFindGallery';

const SLIDE_INTERVAL = 4000;
const MAX_SLIDES = 3;

export default function MobileMain() {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();
  const tabItems = [
    {
      key: 'docent',
      icon: <IcDocent />,
      label: '도슨트 듣기',
      link: '/qrscan',
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

  const formatStatus = (status) => {
    if (status === 'exhibited') {
      return '전시중';
    } else if (status === 'scheduled') {
      return '전시예정';
    } else {
      return '전시종료';
    }
  };

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const response = await instance.get('/api/exhibitions', {
          params: { status: 'exhibited' },
        });

        const parsed = response.data
          .map(({ id, exhibition_poster: image, exhibition_title: title }) => ({
            id,
            image,
            title,
          }))
          .slice(0, MAX_SLIDES);

        setItems(parsed || []);
        setCurrentIndex(0);
      } catch (error) {
        console.error('모바일 메인 전시 정보 로딩 실패:', error);
      }
    };

    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [items]);

  useEffect(() => {
    if (!user) {
      setGalleries([]);
      return;
    }

    const fetchFavGallery = async () => {
      try {
        const response = await userInstance.get('/api/galleries', {
          params: {
            liked_only: 1,
          },
        });

        setGalleries(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavGallery();
  }, [user]);

  return (
    <div className={styles.mobileMain}>
      <div className={styles.carousel}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item?.id}
              className={styles.slide}
              onClick={() => navigate(`/exhibitions/${item?.id}`)}
            >
              <img
                src={item?.image}
                alt={item?.title}
                className={styles.slideImage}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tagline}>
        그림 너머의 세계로 초대하는 <br />
        감성 가이드, ARTLY
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.userText}>
          {!user ? '로그인해주세요' : `${user.user_name}님, 반갑습니다.`}
        </div>
        <div className={styles.itemContainer}>
          {tabItems.map(({ key, icon, label, link }) => (
            <div
              className={styles.itemBox}
              key={key}
              onClick={() => {
                key === 'book' &&
                  localStorage.setItem('showMyCatalogTab', 'true');
                navigate(link);
              }}
            >
              {icon}
              {label}
            </div>
          ))}
        </div>
        <div>
          {!user && galleries.length === 0 ? (
            <div className={styles.nonGalleryBox}>
              아직 관심있는 갤러리가 없네요!
              <br />
              관심 갤러리를 추가하고 소식을 받아보세요.
            </div>
          ) : (
            <div className={styles.exhibitionList}>
              {galleries.map(
                ({ gallery_name, gallery_address, exhibitions }) => (
                  <>
                    {exhibitions.map(
                      ({
                        id,
                        exhibition_poster,
                        exhibition_title,
                        exhibition_status,
                      }) => (
                        <div
                          className={styles.galleryItemCard}
                          key={id}
                          onClick={() => {
                            navigate(`/exhibitions/${id}`);
                          }}
                        >
                          <div className={styles.galleryTitle}>
                            <div>
                              {gallery_name} /{' '}
                              <span className={styles.exhibitionSpan}>
                                {exhibition_title}
                              </span>
                            </div>
                            <FaChevronRight />
                          </div>
                          <div className={styles.addressText}>
                            {gallery_address}
                          </div>
                          <div className={styles.imageBox}>
                            <div
                              className={`${styles.statusBadge} ${exhibition_status === 'exhibited' && styles.ongoing}`}
                            >
                              {formatStatus(exhibition_status)}
                            </div>
                            <img
                              className={styles.exhibitionImage}
                              src={exhibition_poster}
                              alt=''
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
