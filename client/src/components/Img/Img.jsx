import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const FALLBACK_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Cpath d='M140 240 L180 200 L210 230 L250 190 L320 260 H80 Z' fill='%23d1d5db'/%3E%3Ccircle cx='140' cy='140' r='30' fill='%23d1d5db'/%3E%3C/svg%3E`;
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function Img({ src, alt, className, style, ...props }) {
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!src) {
      setImgSrc(FALLBACK_IMAGE);
      return;
    }

    if (
      src.startsWith('http') ||
      src.startsWith('data:') ||
      src.startsWith('blob:')
    ) {
      setImgSrc(src);
    } else {
      const cleanSrc = src.startsWith('/') ? src : `/${src}`;
      setImgSrc(`${BASE_URL}${cleanSrc}`);
    }
  }, [src]);

  const handleError = (e) => {
    if (e.target.src !== FALLBACK_IMAGE) {
      e.target.src = FALLBACK_IMAGE;
    }
  };

  return (
    <LazyLoadImage
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      effect='blur'
      style={{
        objectFit: 'cover',
        ...style,
      }}
      // 2. 🌟 핵심: 이미지 겉을 감싸는 span 태그도 100%로 설정
      wrapperProps={{
        style: {
          transitionDelay: '0.04s',
          display: 'block', // 혹은 "inline-block"
          width: '100%',
          height: '100%',
        },
      }}
      {...props}
    />
  );
}
