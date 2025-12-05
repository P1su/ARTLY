import React, { useEffect, useMemo } from 'react';
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

  // 전시회 목록이 로드된 후 작품 전체 로드 (1회만)
  useEffect(() => {
    if (exhibitionList && exhibitionList.length > 0) {
      loadArtworks('전시회 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhibitionList.length]);

  const handleRegister = () => {
    navigate('/console/artworks/edit/new');
  };

  // 전시회 필터링 (id 기반)
  const filteredArtworkList = useMemo(() => {
    if (!selectedExhibition) {
      return artworkList;
    }
    // exhibition_id로 필터링 (artworkList에 exhibition_id 필드가 있다면 사용, 없으면 title로 매칭)
    const selectedExhibitionTitle = exhibitionList.find(ex => ex.id === selectedExhibition)?.title;
    return artworkList.filter(
      (artwork) => artwork.exhibition_title === selectedExhibitionTitle
    );
  }, [artworkList, selectedExhibition, exhibitionList]);

  // 전시회 옵션 생성 - 작품이 있는 전시회만 표시
  const exhibitionOptions = useMemo(() => {
    const options = [];

    // 작품이 있는 전시회 제목 목록
    const exhibitionsWithArtworks = new Set(
      artworkList
        .map((artwork) => artwork.exhibition_title)
        .filter((title) => title && title !== '전시회 정보 없음')
    );

    if (exhibitionList) {
      exhibitionList.forEach((exhibition) => {
        // 해당 전시회에 작품이 있는 경우에만 추가
        if (exhibitionsWithArtworks.has(exhibition.title)) {
          options.push({
            id: exhibition.id,
            name: exhibition.title,
            value: exhibition.id,
          });
        }
      });
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

  return (
    <section className={styles.contentContainer}>
      {/* 전시회 필터 드롭다운 */}
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedExhibition}
          onChange={onExhibitionChange}
          options={exhibitionOptions}
          placeholder="전시회를 선택하세요"
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredArtworkList.length} />
        <RegisterButton
          buttonText="+작품 등록"
          onButtonClick={handleRegister}
        />
      </div>

      {filteredArtworkList.length > 0 ? (
        <section className={styles.cardContainer}>
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
                  <p className={styles.artworkExhibition}>
                    {artwork.exhibition_title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message="등록된 작품이 없어요."
            buttonText="+작품 등록"
            onButtonClick={handleRegister}
          />
        </section>
      )}
    </section>
  );
}

