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

import styles from './ArtworkManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';

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
  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  /* =========================
     삭제
  ========================= */
  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm(
      '정말로 이 작품을 삭제하시겠습니까?',
      true,
    );

    if (isConfirmed) {
      await onDelete(id, 'artwork');
      navigate('/console/main', {
        state: { activeTab: '작품관리' },
        replace: true,
      });
    }
  };

  /* =========================
     초기 전시회 로드
  ========================= */
  useEffect(() => {
    if (loadExhibitions) {
      loadExhibitions('갤러리 전체');
    }
  }, []);

  /* =========================
     전시회 변경 시 작품 재요청
  ========================= */
  useEffect(() => {
    if (selectedExhibition) {
      if (!exhibitionList || exhibitionList.length === 0) return;

      const target = exhibitionList.find(
        (ex) => String(ex.id) === String(selectedExhibition),
      );

      if (target) {
        loadArtworks(target.title);
      }
    } else {
      loadArtworks('');
    }
  }, [selectedExhibition, exhibitionList, loadArtworks]);

  /* =========================
     등록
  ========================= */
  const handleRegister = () => {
    if (!selectedExhibition) {
      showAlert('작품을 등록할 전시회를 상단 필터에서 먼저 선택해주세요.');
      return;
    }
    navigate(`/console/artworks/edit/new?exhibition_id=${selectedExhibition}`);
  };

  /* =========================
     데이터
  ========================= */
  const filteredArtworkList = useMemo(() => {
    return artworkList || [];
  }, [artworkList]);

  const exhibitionOptions = useMemo(() => {
    if (!exhibitionList) return [];
    return exhibitionList.map((ex) => ({
      id: ex.id,
      name: ex.title,
      value: ex.id,
    }));
  }, [exhibitionList]);

  /* =========================
     🔥 윈도잉 설정
  ========================= */
  const parentRef = useRef(null);
  const isMobile = window.innerWidth < 700;

  const CARD_HEIGHT = isMobile ? 130 : 150; // CSS 기준

  const rowVirtualizer = useVirtualizer({
    count: filteredArtworkList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT,
    overscan: isMobile ? 3 : 6,
  });

  /* =========================
     로딩
  ========================= */
  if (isLoading) {
    return (
      <div className={styles.contentContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  /* =========================
     렌더
  ========================= */
  return (
    <section className={styles.contentContainer}>
      {/* 전시회 필터 */}
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedExhibition}
          onChange={onExhibitionChange}
          options={exhibitionOptions}
          placeholder='전시회를 선택하세요'
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredArtworkList.length} />
        <RegisterButton
          buttonText='+작품 등록'
          onButtonClick={handleRegister}
        />
      </div>

      {filteredArtworkList.length > 0 ? (
        <section className={styles.cardContainer}>
          {/* 스크롤 컨테이너 */}
          <div
            ref={parentRef}
            style={{
              height: 'calc(100vh - 30px)',
              overflowY: 'auto',
            }}
          >
            {/* 전체 높이 계산 */}
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const artwork = filteredArtworkList[virtualRow.index];

                return (
                  <div
                    key={artwork.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {/* 🔽 기존 카드 구조 그대로 */}
                    <div
                      className={styles.artworkCard}
                      onClick={() =>
                        navigate(`/console/artworks/${artwork.id}`)
                      }
                    >
                      <div className={styles.cardContent}>
                        <Img
                          src={artwork.image}
                          alt={artwork.title}
                          className={styles.artworkImage}
                        />

                        <div className={styles.cardInfo}>
                          <div className={styles.cardHeader}>
                            <h3 className={styles.artworkTitle}>
                              {artwork.title}
                            </h3>

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

                          <p className={styles.artworkArtist}>
                            {artwork.artist || '작가 미상'}
                          </p>

                          <p className={styles.artworkExhibition}>
                            {selectedExhibition
                              ? exhibitionList.find(
                                  (ex) =>
                                    String(ex.id) ===
                                    String(selectedExhibition),
                                )?.title
                              : artwork.exhibition_title ||
                                artwork.exhibition_name ||
                                '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* 🔼 */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message='등록된 작품이 없어요.'
            buttonText='+작품 등록'
            onButtonClick={handleRegister}
          />
        </section>
      )}
    </section>
  );
}
