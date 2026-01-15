import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';

import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import Img from '../../../../components/Img/Img.jsx';
import ArtistSelectModal from '../../../ConsoleEdit/components/ArtistSelectModal/ArtistSelectModal.jsx';

import styles from './ArtistManagement.module.css';
import { useAlert } from '../../../../store/AlertProvider.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';

export default function ArtistManagement({
  artistList,
  loadArtists,
  isLoading,
  onDelete,
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
      loadArtists(firstGalleryId);
    }
  }, [galleryList, selectedGallery, onGalleryChange, loadArtists]);

  useEffect(() => {
    if (selectedGallery) {
      loadArtists(selectedGallery);
    }
  }, [selectedGallery]);
  
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    
    const isConfirmed = await showConfirm('이 작가를 갤러리에서 등록 해제하시겠습니까?', true);
    if (isConfirmed) {
      await onDelete(id, 'gallery_artist', selectedGallery);
      loadArtists(selectedGallery);
    }
  };
  
  const handleRegister = () => {
    setIsModalOpen(true);
  };
  
  const filteredArtistList = useMemo(() => {
    if (!selectedGallery) return [];
    return artistList;
  }, [artistList, selectedGallery]);

  const handleArtistSelect = (artist) => {
    setIsModalOpen(false);
    showAlert(`"${artist.artist_name}" 작가가 등록되었습니다.`);
    loadArtists(selectedGallery );
  };

  if (isLoading) {
    return <div className={styles.contentContainer}><LoadingSpinner /></div>;
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.searchContainer}>
        <LookUp
          value={selectedGallery}
          onChange={(id) => {
            onGalleryChange(id);
            loadArtists(id);  
          }}
          options={galleryOptions}
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredArtistList.length} />
        <RegisterButton buttonText='+작가 등록' onButtonClick={handleRegister} />
      </div>

      {filteredArtistList.length > 0 ? (
        <section className={styles.cardList}>
          {filteredArtistList.map((artist) => (
            <div
              key={artist.id}
              className={styles.artistCard}
              onClick={() => navigate(`/console/artists/${artist.id}`, { 
                state: { galleryId: selectedGallery } 
              })}
            >
              <div className={styles.cardContent}>
                <Img src={artist.artist_image} alt={artist.artist_name} className={styles.artistImage} />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.artistName}>{artist.artist_name}</h3>
                    <button onClick={(e) => handleDelete(e, artist.id)} className={styles.deleteButton}>
                      <HiTrash size={18} />
                    </button>
                  </div>
                  <p className={styles.artistCategory}>{artist.artist_category || '분야 미지정'}</p>
                  <p className={styles.artistNation}>{artist.artist_nation || '국적 미지정'}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState message='등록된 작가가 없어요.' buttonText='+작가 등록' onButtonClick={handleRegister} />
        </section>
      )}

      {isModalOpen && (
        <ArtistSelectModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleArtistSelect}
          galleryList={galleryList}
          selectedGalleryId={selectedGallery}
        />
      )}
    </div>
  );
}