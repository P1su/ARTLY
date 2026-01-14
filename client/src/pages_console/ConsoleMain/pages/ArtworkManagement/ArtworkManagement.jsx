import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import Img from '../../../../components/Img/Img.jsx';
import ArtworkSelectModal from '../../../ConsoleEdit/components/ArtworkSelectModal/ArtworkSelectModal.jsx';

import styles from './ArtworkManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';

export default function ArtworkManagement({
  artworkList,
  loadArtworks,
  onDelete,
  isLoading,
  galleryList,
  selectedGallery,
  onGalleryChange,
}) {
  const navigate = useNavigate();
  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const galleryOptions = useMemo(() => {
    const mapped = galleryList?.map((g) => ({
      id: g.id,
      name: g.name,
      value: g.id,
    })) || [];
    return mapped;
  }, [galleryList]);

  useEffect(() => {
    if (
      galleryList?.length > 0 &&
      !selectedGallery
    ) {
      const firstGalleryId = galleryList[0].id;
      onGalleryChange(galleryList[0].id);
      loadArtworks('', firstGalleryId);
    }
  }, [galleryList, selectedGallery, onGalleryChange, loadArtworks]);

  useEffect(() => {
    if (selectedGallery) {
      loadArtworks('', selectedGallery);
    }
  }, [selectedGallery]);

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm('이 작품을 갤러리에서 등록 해제하시겠습니까?', true);
    if (isConfirmed) {
      await onDelete(id, 'gallery_art', selectedGallery);
      loadArtworks('', selectedGallery);
    }
  };
  
  const handleRegister = () => {
    setIsModalOpen(true);
  };
  
  const handleArtworkSelect = (artwork) => {
    setIsModalOpen(false);
    showAlert(`"${artwork.art_title}" 작품이 등록되었습니다.`);
    loadArtworks('', selectedGallery );
  };

  const filteredArtworkList = useMemo(() => {
    if (!selectedGallery) return [];
    return artworkList;
  }, [artworkList, selectedGallery]);

  if (isLoading) {
    return <div className={styles.contentContainer}><LoadingSpinner /></div>;
  }

  return (
    <section className={styles.contentContainer}>
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedGallery}
          onChange={(id) => {
            onGalleryChange(id);
            loadArtworks('', id);
          }}
          options={galleryOptions}
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredArtworkList.length} />
        <RegisterButton buttonText='+작품 등록' onButtonClick={handleRegister} />
      </div>

      {filteredArtworkList.length > 0 ? (
        <section className={styles.cardContainer}>
          {filteredArtworkList.map((artwork) => (
            <div key={artwork.id} className={styles.artworkCard} onClick={() => navigate(`/console/artworks/${artwork.id}`)}>
              <div className={styles.cardContent}>
                <Img src={artwork.image} alt={artwork.title} className={styles.artworkImage} />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.artworkTitle}>{artwork.title}</h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(artwork.id); }}
                      className={styles.deleteButton}
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.artworkArtist}>{artwork.artist || '작가 미상'}</p>
                  <p className={styles.artworkExhibition}>{artwork.exhibition_title || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState message='등록된 작품이 없어요.' buttonText='+작품 등록' onButtonClick={handleRegister} />
        </section>
      )}

      {isModalOpen && (
        <ArtworkSelectModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleArtworkSelect}
          galleryId={selectedGallery}
          galleryList={galleryList}
          mode="global"
          multiSelect={false}
        />
      )}
    </section>
  );
}