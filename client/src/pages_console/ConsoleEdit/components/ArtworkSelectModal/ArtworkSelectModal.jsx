import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './ArtworkSelectModal.module.css';
import { userInstance } from '../../../../apis/instance';

export default function ArtworkSelectModal({ onClose, onSelect }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [artList, setArtList] = useState([]);
  const [selectedArts, setSelectedArts] = useState([]);

  const fetchArts = async (keyword = '') => {
    try {
      const res = await userInstance.get('/api/arts', {
        params: { search: keyword },
      });
      const list = Array.isArray(res.data) ? res.data : res.data.data || [];
      setArtList(list);
    } catch (error) {
      console.error('작품 검색 실패:', error);
    }
  };

  useEffect(() => {
    fetchArts();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchArts(searchKeyword);
  };

  const toggleSelect = (art) => {
    setSelectedArts((prev) => {
      const isSelected = prev.some((item) => item.id === art.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== art.id);
      } else {
        return [...prev, art];
      }
    });
  };

  const handleConfirm = () => {
    onSelect(selectedArts);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>출품 작품 선택</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.searchBar}>
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearch}
              placeholder='작품명 또는 작가명 검색'
            />
            <button onClick={() => fetchArts(searchKeyword)}>
              <FaSearch />
            </button>
          </div>

          <div className={styles.listContainer}>
            {artList.length > 0 ? (
              artList.map((art) => {
                const isSelected = selectedArts.some((a) => a.id === art.id);
                return (
                  <div
                    key={art.id}
                    className={`${styles.artistRow} ${isSelected ? styles.selected : ''}`}
                    onClick={() => toggleSelect(art)}
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      readOnly
                      className={styles.checkbox}
                    />
                    <img
                      src={art.art_image}
                      alt={art.art_title}
                      className={styles.artistImg}
                    />
                    <div className={styles.artistInfo}>
                      <span className={styles.name}>{art.art_title}</span>
                      <span className={styles.category}>
                        {art.artist?.artist_name || '작가미상'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyState}>검색 결과가 없습니다.</p>
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.confirmBtn} onClick={handleConfirm}>
              {selectedArts.length}개 작품 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
