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
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const [galleries, setGalleries] = useState([]);
  const [popularExhibitions, setPopularExhibitions] = useState([]);

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const BASE_URL = import.meta.env.VITE_SERVER_URL || '';
    return `${BASE_URL}/${imagePath}`;
  };

  const formatStatus = (status) => {
    if (status === 'exhibited') return '전시중';
    if (status === 'scheduled') return '전시예정';
    return '전시종료';
  };

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const response = await instance.get('/api/exhibitions', {
          params: { status: 'exhibited' },
        });

        const parsed = response.data
          .map(({ id, exhibition_poster: image, exhibition_title: title }) => ({
            id,
            image: getImageUrl(image),
            title,
          }))
          .slice(0, MAX_SLIDES);

        setCarouselItems(parsed || []);
        setCurrentIndex(0);
      } catch (error) {
        console.error('모바일 메인 캐러셀 로딩 실패:', error);
      }
    };

    fetchCarouselItems();
  }, []);

  useEffect(() => {
    if (carouselItems.length <= 1) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [carouselItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await userInstance.get('/api/galleries', {
            params: { liked_only: 1 },
          });
          setGalleries(response.data);
          setPopularExhibitions([]);
        } else {
          const galleryRes = await instance.get('/api/galleries');
          const sortedGalleries = galleryRes.data
            .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
            .slice(0, 10);
          setGalleries(sortedGalleries);

          const exhibitionRes = await instance.get('/api/exhibitions', {
            params: { status: 'exhibited' },
          });
          const sortedExhibitions = exhibitionRes.data
            .sort((a, b) => (b.like_count || 0) - (a.like_count || 0)) // 좋아요 순 정렬
            .slice(0, 10);
          setPopularExhibitions(sortedExhibitions);
        }
      } catch (error) {
        console.error('데이터 목록 로딩 실패:', error);
      }
    };

    fetchData();
  }, [user]);

  const hasUserInterestExhibition =
    user &&
    galleries.some(
      (g) =>
        g.exhibitions &&
        g.exhibitions.some((ex) => ex.exhibition_status === 'exhibited'),
    );

  return (
    <div className={styles.mobileMain}>
      <div className={styles.carousel}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item) => (
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

        {user && (
          <div>
            <h2 className={styles.titleSection}>| 관심있을 전시회</h2>
            {!hasUserInterestExhibition ? (
              <div className={styles.nonGalleryBox}>
                아직 관심있는 갤러리가 없거나, <br />
                진행 중인 전시가 없습니다.
              </div>
            ) : (
              <div className={styles.exhibitionList}>
                {galleries.map(
                  ({
                    id: gallery_id,
                    gallery_name,
                    gallery_address,
                    exhibitions,
                  }) => (
                    <div key={gallery_id} className={styles.exhibitionList}>
                      {exhibitions
                        ?.filter((ex) => ex.exhibition_status === 'exhibited')
                        .map((ex) => (
                          <div
                            className={styles.galleryItemCard}
                            key={ex.id}
                            onClick={() => navigate(`/exhibitions/${ex.id}`)}
                          >
                            <div className={styles.imageBox}>
                              <div
                                className={`${styles.statusBadge} ${styles.ongoing}`}
                              >
                                {formatStatus(ex.exhibition_status)}
                              </div>
                              <img
                                className={styles.exhibitionImage}
                                src={getImageUrl(ex.exhibition_poster)}
                                alt=''
                              />
                            </div>

                            <div className={styles.cardInfo}>
                              <div className={styles.galleryTitle}>
                                <div className={styles.ellipsisTitle}>
                                  {gallery_name}{' '}
                                  <span
                                    style={{ margin: '0 4px', color: '#ddd' }}
                                  >
                                    |
                                  </span>{' '}
                                  {ex.exhibition_title}
                                </div>
                                <FaChevronRight size={16} />
                              </div>
                              <div className={styles.addressText}>
                                {gallery_address}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className={styles.listSection}>
            <div>
              <h2 className={styles.titleSection}>| 인기 전시회 TOP 10</h2>
              {popularExhibitions.length > 0 ? (
                <div className={styles.exhibitionList}>
                  {popularExhibitions.map((ex) => (
                    <div
                      className={styles.galleryItemCard}
                      key={ex.id}
                      onClick={() => navigate(`/exhibitions/${ex.id}`)}
                    >
                      <div className={styles.imageBox}>
                        <div
                          className={`${styles.statusBadge} ${styles.ongoing}`}
                        >
                          {formatStatus(ex.exhibition_status)}
                        </div>
                        <img
                          className={styles.exhibitionImage}
                          src={getImageUrl(ex.exhibition_poster)}
                          alt={ex.exhibition_title}
                        />
                      </div>

                      <div className={styles.cardInfo}>
                        <div className={styles.galleryTitle}>
                          <div className={styles.ellipsisTitle}>
                            {ex.exhibition_title}
                          </div>
                          <FaChevronRight size={16} />
                        </div>
                        <div className={styles.addressText}>
                          {typeof ex.exhibition_organization === 'object'
                            ? ex.exhibition_organization?.name
                            : ex.exhibition_organization ||
                              ex.exhibition_location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.nonGalleryBox}>
                  현재 진행 중인 인기 전시가 없습니다.
                </div>
              )}
            </div>

            <div>
              <h2 className={styles.titleSection}>| 인기 갤러리 TOP 10</h2>
              {galleries.length > 0 ? (
                <div className={styles.exhibitionList}>
                  {galleries.map((gallery) => {
                    const displayImage =
                      gallery.gallery_image ||
                      gallery.exhibitions?.[0]?.exhibition_poster;

                    return (
                      <div
                        className={styles.galleryItemCard}
                        key={gallery.id}
                        onClick={() => navigate(`/galleries/${gallery.id}`)}
                      >
                        <div className={styles.imageBox}>
                          <img
                            className={styles.exhibitionImage}
                            src={
                              getImageUrl(displayImage) ||
                              '/images/no-image.png'
                            }
                            alt={gallery.gallery_name}
                          />
                        </div>
                        <div className={styles.cardInfo}>
                          <div className={styles.galleryTitle}>
                            <div className={styles.ellipsisTitle}>
                              {gallery.gallery_name}
                            </div>
                            <FaChevronRight size={16} />
                          </div>
                          <div className={styles.addressText}>
                            {gallery.gallery_address || '주소 정보 없음'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.nonGalleryBox}>
                  등록된 갤러리가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
