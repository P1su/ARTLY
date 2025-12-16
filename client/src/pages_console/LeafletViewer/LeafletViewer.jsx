import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { userInstance } from '../../apis/instance';
import styles from './LeafletViewer.module.css';
import Img from '../../components/Img/Img';

export default function LeafletViewer() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const flipBookRef = useRef(null);

  const [leafletData, setLeafletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // 이미지 원본 비율 (세로 / 가로)
  const [aspectRatio, setAspectRatio] = useState(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const isDesktop = windowSize.width > 768;

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. 데이터 조회 및 비율 계산
  useEffect(() => {
    const fetchLeaflet = async () => {
      try {
        setIsLoading(true);
        const apiCategory =
          category === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';

        const res = await userInstance.get(`/api/leaflet`, {
          params: { category: apiCategory, category_id: id },
        });

        const data = Array.isArray(res.data)
          ? res.data.length > 0
            ? res.data[0]
            : null
          : res.data;

        if (data) {
          setLeafletData(data);

          // 첫 번째 이미지의 비율 계산
          if (data.image_urls && data.image_urls.length > 0) {
            const img = new Image();
            img.src = data.image_urls[0];
            img.onload = () => {
              if (img.width > 0) {
                const ratio = img.height / img.width;
                setAspectRatio(ratio);
              }
            };
            img.onerror = () => setAspectRatio(1.414);
          } else {
            setAspectRatio(1.414);
          }
        } else {
          setError('리플렛 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('리플렛을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaflet();
  }, [category, id]);

  const totalPages = leafletData ? leafletData.image_urls.length : 0;

  // 다음 페이지 이동
  const handleNext = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  }, []);

  // 이전 페이지 이동
  const handlePrev = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlePrev, handleNext, navigate]);

  // 로딩 중이거나 비율 계산 전이면 로더 표시
  if (isLoading || (leafletData && !aspectRatio)) {
    return (
      <div className={styles.container}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (error || !leafletData)
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            돌아가기
          </button>
        </div>
      </div>
    );

  const { image_urls, title } = leafletData;
  const bgImage = image_urls[0];

  // 뷰어 크기 동적 계산
  let pageHeight = windowSize.height * 0.85;
  let pageWidth = pageHeight / aspectRatio;

  const maxWidth = isDesktop ? windowSize.width * 0.45 : windowSize.width * 0.9;
  if (pageWidth > maxWidth) {
    pageWidth = maxWidth;
    pageHeight = pageWidth * aspectRatio;
  }

  return (
    <div className={styles.container}>
      {/* 배경 */}
      {bgImage && (
        <div
          className={styles.ambientBackground}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className={styles.overlay} />

      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <button
          className={styles.closeBtn}
          onClick={() => navigate(-1)}
          aria-label='닫기'
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
        </button>
      </header>

      {/* 뷰어 영역 */}
      <div className={styles.bookScene}>
        <HTMLFlipBook
          ref={flipBookRef}
          width={Math.floor(pageWidth)}
          height={Math.floor(pageHeight)}
          size="fixed"
          minWidth={280}
          maxWidth={isDesktop ? Math.floor(windowSize.width * 0.45) : Math.floor(windowSize.width * 0.9)}
          minHeight={Math.floor(280 * aspectRatio)}
          maxHeight={Math.floor((isDesktop ? windowSize.width * 0.45 : windowSize.width * 0.9) * aspectRatio)}
          showCover={false}
          mobileScrollSupport={false}
          className={styles.flipBook}
          onFlip={(e) => setCurrentPage(e.data)}
          usePortrait={!isDesktop}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          useMouseEvents={true}
          swipeDistance={30}
        >
          {image_urls.map((url, index) => (
            <div key={index} className={styles.page}>
              <div className={styles.imageWrapper}>
                <Img src={url} className={styles.pageImage} />
              </div>
              {index > 0 && <div className={styles.pageNumber}>{index}</div>}
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      {/* 하단 컨트롤러 */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          <svg
            width='28'
            height='28'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polyline points='15 18 9 12 15 6' />
          </svg>
        </button>

        <span className={styles.pageIndicator}>
          {currentPage === 0 ? '표지' : `${currentPage} / ${totalPages - 1}`}
        </span>

        <button
          className={styles.navBtn}
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
        >
          <svg
            width='28'
            height='28'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polyline points='9 18 15 12 9 6' />
          </svg>
        </button>
      </div>
    </div>
  );
}
