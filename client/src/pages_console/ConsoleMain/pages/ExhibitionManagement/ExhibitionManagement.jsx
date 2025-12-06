import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import styles from './ExhibitionManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';

export default function ExhibitionManagement({
  exhibitionList,
  selectedGallery,
  onGalleryChange,
  onDelete,
  loadExhibitions,
  isLoading,
  error,
  galleryList,
}) {
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 전시회를 삭제하시겠습니까?')) {
      onDelete(id, 'exhibition');
    }
  };

  // 컴포넌트 마운트 시 전체 전시회 로드 (1회만)
  useEffect(() => {
    if (galleryList.length > 0) {
      loadExhibitions('갤러리 전체');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryList.length]);

  // 갤러리 필터링 (id 기반)
  const filteredExhibitionList = useMemo(() => {
    if (!selectedGallery) {
      return exhibitionList;
    }
    return exhibitionList.filter(
      (exhibition) => exhibition.gallery_id === selectedGallery,
    );
  }, [exhibitionList, selectedGallery]);

  // 갤러리 옵션 - 전시회가 있는 갤러리만 표시
  const galleryOptions = useMemo(() => {
    const options = [];

    // 전시회가 있는 갤러리 ID 목록
    const galleriesWithExhibitions = new Set(
      exhibitionList.map((ex) => ex.gallery_id).filter(Boolean),
    );

    if (galleryList) {
      galleryList.forEach((gallery) => {
        // 해당 갤러리에 전시회가 있는 경우에만 추가
        if (galleriesWithExhibitions.has(gallery.id)) {
          options.push({
            id: gallery.id,
            name: gallery.name,
            value: gallery.id,
          });
        }
      });
    }

    return options;
  }, [galleryList, exhibitionList]);

  // 선택된 갤러리 ID (이제 selectedGallery가 이미 id)
  const selectedGalleryId = selectedGallery;

  const handleRegister = () => {
    if (!selectedGalleryId) {
      showAlert('전시회를 등록할 갤러리를 상단 필터에서 먼저 선택해주세요.');
      return;
    }
    navigate(`/console/exhibitions/edit/new?gallery_id=${selectedGalleryId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className={styles.contentContainer}>
      {/* 갤러리 필터 드롭다운 */}
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedGallery}
          onChange={onGalleryChange}
          options={galleryOptions}
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredExhibitionList.length} />
        <RegisterButton
          buttonText='+전시회 등록'
          onButtonClick={handleRegister}
        />
      </div>

      {filteredExhibitionList.length > 0 ? (
        <section className={styles.cardContainer}>
          {filteredExhibitionList.map((exhibition) => (
            <div
              key={exhibition.id}
              className={styles.galleryCard}
              onClick={() => navigate(`/console/exhibitions/${exhibition.id}`)}
            >
              <div className={styles.cardContent}>
                <img
                  src={exhibition.image}
                  alt={exhibition.title}
                  className={styles.galleryImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.galleryTitle}>{exhibition.title}</h3>
                    <button
                      onClick={(e) => handleDelete(e, exhibition.id)}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.galleryAddress}>{exhibition.period}</p>
                  <p className={styles.galleryFloor}>
                    {exhibition.gallery_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message='등록된 전시회가 없어요.'
            buttonText='+전시회 등록'
          />
        </section>
      )}
    </section>
  );
}
