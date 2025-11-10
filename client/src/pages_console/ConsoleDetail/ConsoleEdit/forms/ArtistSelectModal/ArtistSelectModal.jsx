import { useEffect, useState } from 'react';
import { userInstance } from '../../../../../apis/instance';
import styles from './ArtistSelectModal.module.css';

export default function ArtistSelectModal({ onClose, onSelect, setData }) {
  const [artistSearch, setArtistSearch] = useState('');
  const [artistList, setArtistList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [newArtistName, setNewArtistName] = useState('');

  /** 🧾 전체 작가 목록 불러오기 */
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await userInstance.get('/api/artists');
        setArtistList(res.data || []);
        setFilteredList(res.data || []); // 초기엔 전체 리스트 표시
      } catch (err) {
        console.error('작가 목록 불러오기 실패:', err);
      }
    };
    fetchArtists();
  }, []);

  /** 🔍 검색 기능 (프론트 필터링 or 서버 검색) */
  const handleArtistSearch = async () => {
    const searchTerm = artistSearch.trim();

    if (searchTerm === '') {
      // 검색어 없으면 전체 리스트 복구
      setFilteredList(artistList);
      return;
    }

    try {
      // 서버 검색 방식
      const res = await userInstance.get('/api/artists', {
        params: { search: searchTerm },
      });
      if (res.data && res.data.length > 0) {
        setFilteredList(res.data);
      } else {
        setFilteredList([]);
      }
    } catch (err) {
      console.error('작가 검색 실패:', err);
      setFilteredList([]);
    }
  };

  /** ✅ 작가 선택 */
  const handleSelectArtist = (artist) => {
    setData((prev) => ({
      ...prev,
      artist_name: artist.artist_name,
      artist_id: artist.id,
      artist_image: artist.artist_image,
    }));
    onSelect(artist);
    onClose();
  };

  /** ➕ 작가 추가 */
  const handleAddArtist = async () => {
    if (!newArtistName.trim()) return;
    try {
      const res = await userInstance.post('/api/artists', {
        artist_name: newArtistName.trim(),
      });
      const addedArtist = res.data;

      // 새 작가 리스트에 반영
      setArtistList((prev) => [...prev, addedArtist]);
      setFilteredList((prev) => [...prev, addedArtist]);

      // 선택 반영
      setData((prev) => ({
        ...prev,
        artist_name: addedArtist.artist_name,
        artist_id: addedArtist.id,
      }));
      onSelect(addedArtist);
      onClose();
    } catch (err) {
      console.error('작가 추가 실패:', err);
      alert('작가 추가에 실패했습니다.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 상단 헤더 */}
        <div className={styles.header}>
          <p>작가선택</p>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* 검색창 */}
        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            placeholder='작가이름 검색'
            value={artistSearch}
            onChange={(e) => setArtistSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleArtistSearch()}
          />
          <button className={styles.searchBtn} onClick={handleArtistSearch}>
            검색
          </button>
        </div>

        {/* 작가 리스트 or 결과 없음 */}
        {filteredList.length > 0 ? (
          <div className={styles.artistList}>
            {filteredList.map((artist) => (
              <div key={artist.id} className={styles.artistItem}>
                <div className={styles.artistInfo}>
                  <img
                    src={artist.artist_image || '/default-profile.png'}
                    alt={artist.artist_name}
                    className={styles.artistAvatar}
                  />
                  <div>
                    <p className={styles.artistName}>{artist.artist_name}</p>
                    <p className={styles.artistCategory}>
                      {artist.artist_category} · {artist.artist_nation}
                    </p>
                  </div>
                </div>
                <button
                  className={styles.selectBtn}
                  onClick={() => handleSelectArtist(artist)}
                >
                  선택
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResultBox}>
            <p className={styles.noResult}>
              검색결과가 없어요. 새로 등록해주세요.
            </p>
            <div className={styles.addBox}>
              <div className={styles.addIcon}>＋</div>
              <input
                className={styles.addInput}
                placeholder='작가이름'
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
              />
              <button className={styles.addBtn} onClick={handleAddArtist}>
                작가 추가
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
