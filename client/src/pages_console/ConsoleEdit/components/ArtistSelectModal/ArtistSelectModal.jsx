import { useState, useRef } from 'react'; // useEffect 제거
import { FaSearch, FaPlus, FaUser } from 'react-icons/fa';
import styles from './ArtistSelectModal.module.css';
import { userInstance } from '../../../../apis/instance';
import { useAlert } from '../../../../store/AlertProvider';

export default function ArtistSelectModal({ onClose, onSelect }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [artistList, setArtistList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistImage, setNewArtistImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { showAlert } = useAlert();

  const fetchArtists = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      showAlert('검색어를 입력해주세요.');
      return;
    }

    try {
      const res = await userInstance.get('/api/artist', {
        params: { search: keyword },
      });
      setArtistList(res.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('작가 검색 실패:', error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchArtists(searchKeyword);
    }
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArtistImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddNewArtist = async () => {
    if (!newArtistName.trim()) {
      showAlert('작가 이름을 입력해주세요.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('artist_name', newArtistName);
      if (newArtistImage) formData.append('artist_image', newArtistImage);

      const response = await userInstance.post('/api/artists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showAlert('작가가 성공적으로 등록되었습니다.');
      const createdArtist = response.data.data || response.data;

      if (createdArtist && createdArtist.id) {
        onSelect(createdArtist);
      } else {
        setIsAddingNew(false);
        setNewArtistName('');
        setNewArtistImage(null);
        setNewImagePreview(null);
        setSearchKeyword(newArtistName);
        fetchArtists(newArtistName);
      }
    } catch (error) {
      console.error('작가 등록 실패:', error);
      showAlert('작가 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>작가 선택</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {!isAddingNew ? (
            <div className={styles.listContainer}>
              <div className={styles.searchBar}>
                <input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder='작가 이름 검색'
                  autoFocus
                />
                <button onClick={() => fetchArtists(searchKeyword)}>
                  <FaSearch />
                </button>
              </div>
              {artistList.length > 0 ? (
                artistList.map((artist) => (
                  <div key={artist.id} className={styles.artistRow}>
                    <img
                      src={artist.artist_image || '/images/default_profile.png'}
                      alt={artist.artist_name}
                      className={styles.artistImg}
                      onError={(e) =>
                        (e.target.src = 'https://via.placeholder.com/50')
                      }
                    />
                    <div className={styles.artistInfo}>
                      <span className={styles.name}>{artist.artist_name}</span>
                      <span className={styles.category}>
                        {artist.artist_category || 'Category'}
                      </span>
                    </div>
                    <button
                      className={styles.selectBtn}
                      onClick={() => onSelect(artist)}
                    >
                      선택
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  {!hasSearched ? (
                    <p>작가 이름을 입력하여 검색해주세요.</p>
                  ) : (
                    <>
                      <p>
                        &quot;{searchKeyword}&quot;에 대한 검색 결과가 없습니다.
                      </p>
                      <button
                        className={styles.addNewBtn}
                        onClick={() => setIsAddingNew(true)}
                      >
                        <FaPlus /> 새 작가 등록하기
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.addFormContainer}>
              <p className={styles.addTitle}>새로운 작가 등록</p>
              <div
                className={styles.imageUploadCircle}
                onClick={() => fileInputRef.current.click()}
              >
                {newImagePreview ? (
                  <img src={newImagePreview} alt='Preview' />
                ) : (
                  <div className={styles.placeholder}>
                    <FaUser />
                    <span>사진 등록</span>
                  </div>
                )}
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleNewImageChange}
                  hidden
                />
              </div>
              <input
                className={styles.addInput}
                placeholder='작가 이름 입력'
                value={newArtistName}
                onChange={(e) => setNewArtistName(e.target.value)}
              />
              <div className={styles.formActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsAddingNew(false)}
                >
                  취소
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleAddNewArtist}
                >
                  작가 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
