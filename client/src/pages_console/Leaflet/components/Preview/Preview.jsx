import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './Preview.module.css';

const BOOK_RATIO = 1.414; // A4 비율

export default function Preview({ isOpen, onClose, coverImage, imageList }) {
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth > 767);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const totalPages = (coverImage ? 1 : 0) + imageList.length;
  
  // 미리보기가 열릴 때 currentPage를 0으로 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
    }
  }, [isOpen]);
  
  // totalPages가 변경되고 currentPage가 범위를 벗어나면 조정
  useEffect(() => {
    if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);
  
  // A4 비율 계산
  const pageConfig = {
    desktop: { width: 500 },
    mobile: { width: 300 }
  };
  
  const config = isDesktop ? pageConfig.desktop : pageConfig.mobile;
  const pageWidth = config.width;
  const pageHeight = Math.round(pageWidth * BOOK_RATIO);
  
  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen || !flipBookRef.current) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          flipBookRef.current.pageFlip().flipPrev();
          break;
        case 'ArrowRight':
          flipBookRef.current.pageFlip().flipNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);
  
  if (!isOpen || totalPages === 0) return null;
  
  return (
    <div className={styles.overlayBox} onClick={onClose}>
      <div className={styles.bookletContainerBox} onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        
        {/* 플립북 뷰어 */}
        <HTMLFlipBook
          ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            minWidth={280}
            maxWidth={isDesktop ? 600 : 350}
            minHeight={Math.round(280 * BOOK_RATIO)}
            maxHeight={Math.round((isDesktop ? 600 : 350) * BOOK_RATIO)}
            size="fixed"
            showCover={true}
            mobileScrollSupport={true}
            className={styles.flipBook}
            onFlip={(e) => {
              const page = e.data;
              // 페이지 범위 체크
              if (page >= 0 && page < totalPages) {
                setCurrentPage(page);
              }
            }}
            showPageCorners={true}
            usePortrait={!isDesktop}
            useMouseEvents={true}
            swipeDistance={50}
            clickEventForward={true}
            disableFlipByClick={false}
            startPage={0}
            drawShadow={true}
            flippingTime={800}
            usePageShadow={true}
            autoSize={false}
            maxShadowOpacity={0.3}
            startZIndex={1}
          >
            {/* 표지 페이지 */}
            {coverImage && (
              <div className={styles.pageBox}>
                <img src={coverImage.url} alt="표지" className={styles.pageImage} />
              </div>
            )}
            
            {/* 내지 페이지들 */}
            {imageList.map((image, index) => (
              <div key={index} className={styles.pageBox}>
                <img src={image.url} alt={`페이지 ${index + 1}`} className={styles.pageImage} />
              </div>
            ))}
          </HTMLFlipBook>
      </div>
      
      {/* 페이지 번호 표시 */}
      <div className={styles.pageNumberSpan}>
        {currentPage + 1} / {totalPages}
      </div>
    </div>
  );
}