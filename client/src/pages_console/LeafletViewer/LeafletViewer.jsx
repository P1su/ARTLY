import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userInstance } from '../../apis/instance';
import styles from './LeafletViewer.module.css';
import Img from '../../components/Img/Img';

export default function LeafletViewer() {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [leafletData, setLeafletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 보고 있는 페이지 인덱스 (0:표지, 1:내지1, 2:내지2...)
  // 데스크탑에서는 1,2가 동시에 보임
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 원본 비율 (세로 / 가로) -> 높이가 너비의 몇 배인지
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

          // [핵심] 첫 번째 이미지의 비율 계산 (이 비율로 뷰어 크기 고정)
          if (data.image_urls && data.image_urls.length > 0) {
            const img = new Image();
            img.src = data.image_urls[0];
            img.onload = () => {
              if (img.width > 0) {
                const ratio = img.height / img.width;
                console.log('Calculated Aspect Ratio:', ratio);
                setAspectRatio(ratio);
              }
            };
            // 이미지 로드 실패해도 데이터는 보여줌 (기본 비율 사용)
            img.onerror = () => setAspectRatio(1.414);
          } else {
            setAspectRatio(1.414); // 기본 A4
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
    if (!leafletData) return;

    if (isDesktop) {
      if (currentIndex === 0) {
        // 표지 -> 1,2 페이지 펼침
        setCurrentIndex(1);
      } else {
        // 1,2 -> 3,4 ... (2장씩 이동)
        if (currentIndex + 2 < totalPages) {
          setCurrentIndex((prev) => prev + 2);
        } else if (currentIndex + 1 < totalPages) {
          // 마지막 장이 하나 남았을 때
          setCurrentIndex((prev) => prev + 1);
        }
      }
    } else {
      // 모바일: 1장씩 이동
      if (currentIndex < totalPages - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [leafletData, currentIndex, isDesktop, totalPages]);

  // 이전 페이지 이동
  const handlePrev = useCallback(() => {
    if (isDesktop) {
      if (currentIndex === 1) {
        // 1,2 -> 표지(0)
        setCurrentIndex(0);
      } else if (currentIndex > 1) {
        // 3,4 -> 1,2
        setCurrentIndex((prev) => prev - 2);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  }, [currentIndex, isDesktop]);

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

  // --- 뷰어 크기 동적 계산 ---
  // 화면 높이의 85%를 기준으로 단면 높이 설정
  let pageHeight = windowSize.height * 0.85;
  // 비율에 따라 너비 계산 (높이 / 비율)
  let pageWidth = pageHeight / aspectRatio;

  // 너비가 화면을 너무 차지하면 너비 기준으로 재조정
  const maxWidth = isDesktop ? windowSize.width * 0.45 : windowSize.width * 0.9;
  if (pageWidth > maxWidth) {
    pageWidth = maxWidth;
    pageHeight = pageWidth * aspectRatio;
  }

  // 렌더링할 페이지 결정
  let isCover = false;
  let leftUrl = null;
  let rightUrl = null;
  let leftIndex = -1;
  let rightIndex = -1;

  if (isDesktop) {
    if (currentIndex === 0) {
      isCover = true;
      // 표지는 중앙(또는 오른쪽)에 하나만
      rightUrl = image_urls[0];
      rightIndex = 0;
    } else {
      // 1,2 페이지 펼침
      // currentIndex가 홀수(1, 3, 5...)여야 함
      // 실제 데이터 인덱스: 1(왼), 2(오)
      leftUrl = image_urls[currentIndex];
      leftIndex = currentIndex;

      if (currentIndex + 1 < totalPages) {
        rightUrl = image_urls[currentIndex + 1];
        rightIndex = currentIndex + 1;
      }
    }
  } else {
    // 모바일: 현재장 하나만
    rightUrl = image_urls[currentIndex];
    rightIndex = currentIndex;
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

      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {/* 뒤로 가기 (탭 닫기 아님, SPA 이동) */}
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
        <div
          className={styles.bookContainer}
          style={{
            height: Math.floor(pageHeight),
            // 표지거나 모바일이면 1장 너비, 펼침면이면 2장 너비
            width:
              isCover || !isDesktop
                ? Math.floor(pageWidth)
                : Math.floor(pageWidth * 2),
          }}
        >
          {/* 중앙 접힘 그림자 (데스크탑 펼침 상태일 때만) */}
          {!isCover && isDesktop && <div className={styles.spineShadow} />}

          {/* 왼쪽 페이지 (데스크탑 펼침 상태일 때만 존재) */}
          {leftUrl && (
            <div
              className={`${styles.page} ${styles.pageLeft}`}
              style={{ width: '50%' }}
            >
              <div className={styles.imageWrapper}>
                <Img src={leftUrl} className={styles.pageImage} />
              </div>
              {/* 페이지 번호: 표지(0) 다음 내지(1)부터 시작하도록 표시 */}
              <div className={styles.pageNumber}>{leftIndex}</div>
            </div>
          )}

          {/* 오른쪽 페이지 (표지, 모바일단면, 데스크탑오른쪽) */}
          {rightUrl && (
            <div
              className={`${styles.page} ${isDesktop && !isCover ? styles.pageRight : ''}`}
              style={{ width: isCover || !isDesktop ? '100%' : '50%' }}
            >
              <div className={styles.imageWrapper}>
                <Img src={rightUrl} className={styles.pageImage} />
              </div>
              {/* 표지는 번호 없음, 내지는 인덱스 표시 */}
              {!isCover && (
                <div className={styles.pageNumber}>{rightIndex}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 하단 컨트롤러 */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={currentIndex === 0}
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
          {/* 데스크탑에서 펼침 상태일 때 "1-2 / 5" 형태로 표시 */}
          {isDesktop
            ? isCover
              ? '표지'
              : `${currentIndex}-${Math.min(currentIndex + 1, totalPages - 1)} / ${totalPages - 1}`
            : `${currentIndex === 0 ? '표지' : `${currentIndex} / ${totalPages - 1}`}`}
        </span>

        <button
          className={styles.navBtn}
          onClick={handleNext}
          disabled={
            isDesktop
              ? currentIndex + 2 >= totalPages &&
                !isCover &&
                currentIndex + 1 >= totalPages
              : currentIndex === totalPages - 1
          }
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
