import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import Spinner from '../../components/Spinner/Spinner';
import styles from './ArtworkManagement.module.css';

export default function ArtworkManagement({
  artworkList,
  selectedGallery,
  onGalleryChange,
  onDelete,
  loadArtworks,
  isLoading,
  error,
  galleryList,
}) {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 작품을 삭제하시겠습니까?')) {
      onDelete(id, 'artwork');
    }
  };

  // 갤러리를 ID로 변환하는 함수
  const getGalleryId = useCallback(
    (galleryName) => {
      if (galleryName === '갤러리 전체') {
        return '갤러리 전체';
      }
      const gallery = galleryList.find((g) => g.name === galleryName);
      return gallery ? gallery.id : '갤러리 전체';
    },
    [galleryList],
  );

  // 컴포넌트 마운트 시 및 갤러리 선택 변경 시 API 호출
  useEffect(() => {
    if (galleryList.length > 0 && selectedGallery) {
      const galleryId = getGalleryId(selectedGallery);
      loadArtworks(galleryId);
    } else if (galleryList.length > 0) {
      // galleryList는 있지만 selectedGallery가 없거나 비어있을 경우 초기 로드
      loadArtworks('갤러리 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGallery, galleryList]);

  // 선택된 갤러리의 ID 계산
  const selectedGalleryId = useMemo(() => {
    return getGalleryId(selectedGallery);
  }, [selectedGallery, galleryList, getGalleryId]);

  // 서버 필터링이 제대로 작동하지 않는 경우를 대비해 클라이언트 필터링 추가
  const filteredArtworkList = artworkList.filter((artwork) => {
    if (selectedGallery === '갤러리 전체') {
      return true;
    }
    // 갤러리 ID로도 비교 (더 정확함)
    if (artwork.gallery_id && selectedGalleryId) {
      return String(artwork.gallery_id) === String(selectedGalleryId);
    }
    return artwork.gallery_name === selectedGallery;
  });

  // 갤러리 옵션에 "갤러리 전체" 추가
  // 실제로 작품이 있는 갤러리만 필터링
  const galleryOptions = useMemo(() => {
    const options = [{ id: 'all', name: '갤러리 전체', value: '갤러리 전체' }];

    // 작품 목록에서 실제로 사용되는 갤러리 ID/이름 추출
    const usedGalleryIds = new Set(
      artworkList.map((art) => art.gallery_id).filter(Boolean),
    );
    const usedGalleryNames = new Set(
      artworkList.map((art) => art.gallery_name).filter(Boolean),
    );

    // galleryList에서 실제로 작품이 있는 갤러리만 필터링
    galleryList.forEach((gallery) => {
      if (
        usedGalleryIds.has(gallery.id) ||
        usedGalleryNames.has(gallery.name)
      ) {
        options.push({
          id: gallery.id,
          name: gallery.name,
          value: gallery.name,
        });
      }
    });

    return options;
  }, [galleryList, artworkList]);

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.errorMessage}>오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  if (filteredArtworkList.length > 0) {
    return (
      <section className={styles.contentContainer}>
        <LookUp
          value={selectedGallery}
          onChange={onGalleryChange}
          options={galleryOptions}
        />

        <div className={styles.countAndButtonContainer}>
          <CountList count={filteredArtworkList.length} />
          <RegisterButton
            buttonText='+작품 등록'
            onButtonClick={() => alert('작품 등록')}
          />
        </div>

        <section className={styles.contentContainer}>
          {filteredArtworkList.map((artwork) => (
            <div
              key={artwork.id}
              className={styles.artworkCard}
              onClick={() => navigate(`/console/artworks/${artwork.id}`)}
            >
              <div className={styles.artworkContent}>
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className={styles.artworkImage}
                />
                <div className={styles.artworkInfo}>
                  <div>
                    <h3 className={styles.artworkTitle}>{artwork.title}</h3>
                    <p className={styles.artworkArtist}>{artwork.artist}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className={styles.deleteButton}
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </section>
    );
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedGallery}
          onChange={onGalleryChange}
          options={galleryOptions}
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={0} />
        <RegisterButton
          buttonText='+작품 등록'
          onButtonClick={() => alert('작품 등록')}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState message='등록된 작품이 없어요.' buttonText='+작품 등록' />
      </section>
    </>
  );
}
