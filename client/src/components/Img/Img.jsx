import React, { useState, useEffect, memo } from 'react';
// 👇 실무에서 가장 많이 쓰는 이미지 최적화 라이브러리
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // 블러 효과 스타일(필수)

const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cpath d='M140 240 L180 200 L210 230 L250 190 L320 260 H80 Z' fill='%23d1d5db'/%3E%3Ccircle cx='140' cy='140' r='30' fill='%23d1d5db'/%3E%3C/svg%3E`;
const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Img = memo(({ src, alt, className, style, ...props }) => {
  const [displaySrc, setDisplaySrc] = useState('');

  // 1. URL 정규화 로직 (기존 유지 - 백엔드 이미지 경로 처리용)
  useEffect(() => {
    if (!src) {
      setDisplaySrc(FALLBACK_IMAGE);
      return;
    }
    if (
      src.startsWith('http') ||
      src.startsWith('data:') ||
      src.startsWith('blob:')
    ) {
      setDisplaySrc(src);
    } else {
      const cleanSrc = src.startsWith('/') ? src : `/${src}`;
      setDisplaySrc(`${BASE_URL}${cleanSrc}`);
    }
  }, [src]);

  // 2. 에러 핸들링 (기존 유지)
  const handleError = (e) => {
    // 라이브러리 내부 img 태그에서 에러 발생 시 처리
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    // 👇 일반 <img> 태그 대신 라이브러리 컴포넌트 사용
    <LazyLoadImage
      src={displaySrc || FALLBACK_IMAGE}
      alt={alt}
      className={className}
      // ✨ 핵심 최적화 기능 (라이브러리가 알아서 해줌)
      effect='blur' // 로딩 전 흐릿하게 보여주는 효과 (인스타 스타일)
      threshold={100} // 화면에 보이기 100px 전부터 로딩 시작
      onError={handleError}
      // 스타일 유지 (라이브러리 래퍼와 이미지 모두에 적용)
      wrapperProps={{
        style: { display: 'inline-block', width: '100%', height: '100%' },
      }}
      style={{
        ...style,
        objectFit: 'cover', // 기존 스타일 유지
        width: '100%',
        height: '100%',
      }}
      {...props}
    />
  );
});

Img.displayName = 'Img';

export default Img;
