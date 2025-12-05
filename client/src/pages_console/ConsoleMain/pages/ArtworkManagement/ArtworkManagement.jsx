import React, { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import styles from './ArtworkManagement.module.css';

export default function ArtworkManagement({
  artworkList,
  selectedExhibition,
  onExhibitionChange,
  onDelete,
  loadArtworks,
  loadExhibitions,
  isLoading,
  error,
  galleryList,
  exhibitionList,
}) {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 작품을 삭제하시겠습니까?')) {
      onDelete(id, 'artwork');
    }
  };

  // 컴포넌트 마운트 시 전시회 목록 로드
  useEffect(() => {
    if (loadExhibitions) {
      loadExhibitions('갤러리 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 전시회 목록이 로드된 후 작품 로드
  useEffect(() => {
    if (exhibitionList && exhibitionList.length > 0) {
      loadArtworks('전시회 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhibitionList]);

  // 전시회 선택 변경 시 작품 재로드
  useEffect(() => {
    if (selectedExhibition && selectedExhibition !== '전시회 전체') {
      loadArtworks(selectedExhibition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExhibition]);

  // 서버 필터링이 제대로 작동하지 않는 경우를 대비해 클라이언트 필터링 추가
  const filteredArtworkList = artworkList.filter((artwork) => {
    if (selectedExhibition === '전시회 전체') {
      return true;
    }
    return artwork.exhibition_title === selectedExhibition;
  });

  // 전시회 옵션 생성 - 작품이 있는 전시회만 포함
  const exhibitionOptions = useMemo(() => {
    const options = [{ id: 'all', name: '전시회 전체', value: '전시회 전체' }];

    if (artworkList && artworkList.length > 0) {
      // artworkList에서 실제로 작품이 있는 전시회만 추출
      const exhibitionTitles = new Set();
      artworkList.forEach((artwork) => {
        if (artwork.exhibition_title && artwork.exhibition_title !== '전시회 정보 없음') {
          exhibitionTitles.add(artwork.exhibition_title);
        }
      });

      // exhibitionList에서 작품이 있는 전시회만 필터링
      if (exhibitionList) {
        exhibitionList.forEach((exhibition) => {
          if (exhibitionTitles.has(exhibition.title)) {
            options.push({
              id: exhibition.id,
              name: exhibition.title,
              value: exhibition.title,
            });
          }
        });
      }
    }

    return options;
  }, [exhibitionList, artworkList]);

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
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
          value={selectedExhibition}
          onChange={onExhibitionChange}
          options={exhibitionOptions}
        />

        <div className={styles.countAndButtonContainer}>
          <CountList count={filteredArtworkList.length} />
          <RegisterButton
            buttonText='+작품 등록'
            onButtonClick={() => navigate(`/console/artworks/edit/new`)}
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
                <img
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
                  <p className={styles.artworkExhibition}>{artwork.exhibition_title}</p>
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
          value={selectedExhibition}
          onChange={onExhibitionChange}
          options={exhibitionOptions}
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
