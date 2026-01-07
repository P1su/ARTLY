import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import { useVirtualizer } from '@tanstack/react-virtual';

import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import Img from '../../../../components/Img/Img.jsx';

import styles from './ExhibitionManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';
const isMobile = window.innerWidth < 700;
const isPc = window.innerWidth > 1000;

const ESTIMATED_CARD_HEIGHT = isPc ? 180 : isMobile ? 130 : 150;
const LIST_HEIGHT = 600;

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
  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  /* =========================
     🔥 모든 hook은 여기서 먼저
  ========================== */
  const parentRef = useRef(null);

  const filteredExhibitionList = useMemo(() => {
    if (!selectedGallery || selectedGallery === 'all') return exhibitionList;
    return exhibitionList.filter(
      (exhibition) => exhibition.gallery_id === selectedGallery,
    );
  }, [exhibitionList, selectedGallery]);

  const rowVirtualizer = useVirtualizer({
    count: filteredExhibitionList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_CARD_HEIGHT,
    overscan: isMobile ? 3 : 6,
  });

  const galleryOptions = useMemo(() => {
    const allOption = {
      id: 'all',
      name: '전체',
      value: 'all',
    };

    const mapped = 
      galleryList?.map((gallery) => ({
        id: gallery.id,
        name: gallery.name,
        value: gallery.id,
      })) || [];

    return [allOption, ...mapped];
  }, [galleryList]);

  // console.log(
  //   '전체:',
  //   filteredExhibitionList.length,
  //   '렌더:',
  //   rowVirtualizer.getVirtualItems().length,
  // );

  useEffect(() => {
    if (galleryList.length > 0) {
      loadExhibitions('갤러리 전체');
    }
  }, [galleryList.length]);

  /* =========================
     핸들러
  ========================== */
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const isConfirmed = await showConfirm(
      '정말로 이 전시회를 삭제하시겠습니까?',
      true,
    );

    if (isConfirmed) {
      await onDelete(id, 'exhibition');
      navigate('/console/main', {
        state: { activeTab: '전시회관리' },
        replace: true,
      });
    }
  };

  const handleRegister = () => {
    if (!selectedGallery || selectedGallery === 'all') {
      showAlert('전시회를 등록할 갤러리를 상단 필터에서 먼저 선택해주세요.');
      return;
    }
    navigate(`/console/exhibitions/edit/new?gallery_id=${selectedGallery}`);
  };

  /* =========================
     ✅ JSX에서만 분기
  ========================== */
  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className={styles.contentContainer}>
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
          {/* 스크롤 컨테이너 */}
          <div
            ref={parentRef}
            style={{
              height: 'calc(100vh - 30px)', // 필요 시 조절
              overflowY: 'auto',
            }}
          >
            {/* 전체 높이 계산용 */}
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const exhibition = filteredExhibitionList[virtualRow.index];

                return (
                  <div
                    key={exhibition.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {/* 🔽 여기부터는 기존 카드 구조 그대로 */}
                    <div
                      className={styles.galleryCard}
                      onClick={() =>
                        navigate(`/console/exhibitions/${exhibition.id}`)
                      }
                    >
                      <div className={styles.cardContent}>
                        <Img
                          src={exhibition.image}
                          alt={exhibition.title}
                          className={styles.galleryImage}
                        />

                        <div className={styles.cardInfo}>
                          <div className={styles.cardHeader}>
                            <h3 className={styles.galleryTitle}>
                              {exhibition.title}
                            </h3>

                            <button
                              onClick={(e) => handleDelete(e, exhibition.id)}
                              className={styles.deleteButton}
                            >
                              <HiTrash size={18} />
                            </button>
                          </div>

                          <p className={styles.galleryAddress}>
                            {!exhibition.period.includes('null')
                              ? exhibition.period.replace(' - ', ' ~ ')
                              : '기간 정보 없음'}
                          </p>

                          <p className={styles.galleryFloor}>
                            {exhibition.gallery_name}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* 🔼 여기까지 기존 디자인 그대로 */}
                  </div>
                );
              })}
            </div>
          </div>
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
