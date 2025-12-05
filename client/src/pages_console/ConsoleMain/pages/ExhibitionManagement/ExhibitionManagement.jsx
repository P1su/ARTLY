import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import styles from './ExhibitionManagement.module.css';

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

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 전시회를 삭제하시겠습니까?')) {
      onDelete(id, 'exhibition');
    }
  };

  // 컴포넌트 마운트 시 및 갤러리 선택 변경 시 API 호출
  useEffect(() => {
    if (galleryList.length > 0 && selectedGallery) {
      loadExhibitions(selectedGallery);
    } else if (galleryList.length > 0) {
      loadExhibitions('갤러리 전체');
    }
  }, [selectedGallery, galleryList]);

  // 갤러리 필터링
  const filteredExhibitionList = useMemo(() => {
    if (selectedGallery === '갤러리 전체') {
      return exhibitionList;
    }
    return exhibitionList.filter(
      (exhibition) => exhibition.gallery_name === selectedGallery
    );
  }, [exhibitionList, selectedGallery]);

  // 갤러리 옵션
  const galleryOptions = useMemo(() => {
    const options = [{ id: 'all', name: '갤러리 전체', value: '갤러리 전체' }];

    const usedGalleryIds = new Set(
      exhibitionList.map((ex) => ex.gallery_id).filter(Boolean)
    );
    const usedGalleryNames = new Set(
      exhibitionList.map((ex) => ex.gallery_name).filter(Boolean)
    );

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
  }, [galleryList, exhibitionList]);

  // 선택된 갤러리 ID
  const selectedGalleryId = useMemo(() => {
    if (!selectedGallery || selectedGallery === '갤러리 전체') {
      return null;
    }
    const gallery = galleryList.find((g) => g.name === selectedGallery);
    return gallery?.id || null;
  }, [selectedGallery, galleryList]);

  const handleRegister = () => {
    if (!selectedGalleryId) {
      alert('전시회를 등록할 갤러리를 상단 필터에서 먼저 선택해주세요.');
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
      <LookUp
        value={selectedGallery}
        onChange={onGalleryChange}
        options={galleryOptions}
      />

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredExhibitionList.length} />
        <RegisterButton
          buttonText="+전시회 등록"
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
            message="등록된 전시회가 없어요."
            buttonText="+전시회 등록"
          />
        </section>
      )}
    </section>
  );
}

