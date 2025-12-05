import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import styles from './ArtworkManagement.module.css';
import Img from '../../../../components/Img/Img.jsx';

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

  // 갤러리 이름으로 ID를 찾는 함수
  const getGalleryId = useCallback(
    (galleryName) => {
      if (!galleryName || galleryName === '갤러리 전체') {
        return '갤러리 전체';
      }
      const gallery = galleryList.find((g) => g.name === galleryName);
      return gallery ? gallery.id : '갤러리 전체';
    },
    [galleryList],
  );

  // 현재 선택된 갤러리 ID (useMemo로 최적화)
  const selectedGalleryId = useMemo(() => {
    return getGalleryId(selectedGallery);
  }, [selectedGallery, getGalleryId]);

  const handleRegister = () => {
    let url = '/console/artworks/edit/new';

    // 특정 갤러리가 선택되어 있다면 ID를 함께 보냄
    if (selectedGalleryId && selectedGalleryId !== '갤러리 전체') {
      url += `?gallery_id=${selectedGalleryId}`;
    }

    navigate(url);
  };

  // 컴포넌트 마운트 시 및 갤러리 선택 변경 시 API 호출
  useEffect(() => {
    // 갤러리 리스트가 로드된 상태라면
    if (galleryList.length > 0) {
      loadArtworks(selectedGalleryId);
    }
  }, [selectedGalleryId, galleryList, loadArtworks]);

  // 서버 필터링 보완용 클라이언트 필터링
  const filteredArtworkList = artworkList.filter((artwork) => {
    if (!selectedGallery || selectedGallery === '갤러리 전체') {
      return true;
    }
    // ID 비교 우선
    if (
      artwork.gallery_id &&
      selectedGalleryId &&
      selectedGalleryId !== '갤러리 전체'
    ) {
      return String(artwork.gallery_id) === String(selectedGalleryId);
    }
    return artwork.gallery_name === selectedGallery;
  });

  const galleryOptions = useMemo(() => {
    const options = [{ id: 'all', name: '갤러리 전체', value: '갤러리 전체' }];

    if (Array.isArray(galleryList)) {
      galleryList.forEach((gallery) => {
        options.push({
          id: gallery.id,
          name: gallery.name,
          value: gallery.name,
        });
      });
    }

    return options;
  }, [galleryList]);

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
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
            onButtonClick={handleRegister}
          />
        </div>

        <section className={styles.contentContainer}>
          {filteredArtworkList.map((artwork) => (
            <div
              key={artwork.id}
              className={styles.artworkCard}
              onClick={() => navigate(`/console/artworks/${artwork.id}`)}
            >
              <div className={styles.cardContent}>
                <Img
                  src={artwork.image}
                  alt={artwork.title}
                  className={styles.artworkImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.artworkTitle}>{artwork.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(artwork.id);
                      }}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.artworkArtist}>{artwork.artist}</p>
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
          onButtonClick={handleRegister}
        />
      </div>

      <section className={styles.emptyStateContainer}>
        <EmptyState
          message='등록된 작품이 없어요.'
          buttonText='+작품 등록'
          onButtonClick={handleRegister}
        />
      </section>
    </>
  );
}
