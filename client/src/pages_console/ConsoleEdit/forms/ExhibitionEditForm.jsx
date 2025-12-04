import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import ArtistSelectModal from '../components/ArtistSelectModal/ArtistSelectModal.jsx';
import ArtworkSelectModal from '../components/ArtworkSelectModal/ArtworkSelectModal.jsx';

export default function ExhibitionEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showArtworkModal, setShowArtworkModal] = useState(false);

  useEffect(() => {
    if (data.exhibition_poster && typeof data.exhibition_poster === 'string') {
      setImagePreviewUrl(data.exhibition_poster);
    }
  }, [data.exhibition_poster]);

  const getArtImage = (art) => {
    return art.image_url || art.art_image || '/images/no-image.png';
  };

  const getArtTitle = (art) => {
    return art.title || art.art_title || '제목 없음';
  };

  const getArtistName = (art) => {
    return art.artist_name || art.artist?.artist_name || '작가 미상';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html) => {
    setData((prev) => ({ ...prev, exhibition_description: html }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    event.target.value = '';
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreviewUrl(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectArtist = (artist) => {
    const currentArtists = data.artists || [];

    if (currentArtists.some((a) => a.artist_id === artist.id)) {
      alert('이미 추가된 작가입니다.');
      return;
    }

    const newArtist = {
      artist_id: artist.id,
      name: artist.artist_name,
    };

    setData((prev) => ({
      ...prev,
      artists: [...currentArtists, newArtist],
    }));
    setShowArtistModal(false);
  };

  const handleRemoveArtist = (id) => {
    const updatedArtists = (data.artists || []).filter(
      (artist) => artist.artist_id !== id,
    );
    setData((prev) => ({ ...prev, artists: updatedArtists }));
  };

  const handleSelectArtworks = (selectedList) => {
    setData((prev) => ({
      ...prev,
      artworks: selectedList,
    }));
  };

  const handleRemoveArtwork = (artId) => {
    setData((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((a) => a.id !== artId),
    }));
  };

  const daysOfWeek = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  const handleCheckboxChange = (e) => {
    const { value: day, checked } = e.target;

    const currentClosedDays = data.exhibition_closed_day
      ? data.exhibition_closed_day.split(',').map((d) => d.trim())
      : [];

    let newClosedDays;
    if (checked) {
      newClosedDays = [...new Set([...currentClosedDays, day])];
    } else {
      newClosedDays = currentClosedDays.filter((d) => d !== day);
    }

    const daysOrder = daysOfWeek;
    newClosedDays.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    setData((prev) => ({
      ...prev,
      exhibition_closed_day: newClosedDays.join(', '),
    }));
  };

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='exhibition_title'
          value={data.exhibition_title || ''}
          onChange={handleInputChange}
          placeholder='전시회 제목'
        />

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          accept='image/*'
          style={{ display: 'none' }}
        />

        <div
          className={styles.imageUploadBox}
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreviewUrl ? (
            <>
              <img
                src={imagePreviewUrl}
                alt='전시 포스터 미리보기'
                className={styles.previewImage}
              />
              <button
                type='button'
                onClick={handleRemoveImage}
                className={styles.imageDelBtn}
                title='이미지 삭제'
              >
                ✕
              </button>
            </>
          ) : (
            <p className={styles.previewImageDesc}>
              + 전시 포스터를 업로드 해주세요
            </p>
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>전시기간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_start_date'
                value={data.exhibition_start_date || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_end_date'
                value={data.exhibition_end_date || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>관람시간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_start_time'
                value={data.exhibition_start_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_end_time'
                value={data.exhibition_end_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>휴관일</label>
            <div className={styles.checkboxGroup}>
              {daysOfWeek.map((day) => (
                <label key={day}>
                  <input
                    type='checkbox'
                    name='closedDays'
                    value={day}
                    checked={data.exhibition_closed_day?.includes(day)}
                    onChange={handleCheckboxChange}
                  />{' '}
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전시장소</label>
            <input
              className={styles.input}
              name='exhibition_organization'
              value={data.exhibition_organization || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>주소</label>
            <input
              className={styles.input}
              name='exhibition_location'
              value={data.exhibition_location || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>입장료</label>
            <input
              className={styles.input}
              name='exhibition_price'
              value={data.exhibition_price || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              className={styles.input}
              name='exhibition_phone'
              value={data.exhibition_phone || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>참여 작가 등록</label>

            <div className={styles.artistListContainer}>
              <button
                type='button'
                className={styles.addArtistBtn}
                onClick={() => setShowArtistModal(true)}
                style={{
                  marginBottom: '10px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                + 작가 검색 및 추가
              </button>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {(data.artists || []).map((artist, index) => (
                  <div
                    key={artist.artist_id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', flex: 1 }}>
                      {artist.name}
                    </span>

                    <button
                      type='button'
                      onClick={() => handleRemoveArtist(artist.artist_id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'red',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.artworkSection}`}>
            <label className={styles.label}>출품 작품 관리</label>
            <div className={styles.artistListContainer}>
              <button
                type='button'
                className={styles.addArtworkBtn}
                onClick={() => setShowArtworkModal(true)}
              >
                + 작품 불러오기
              </button>

              <div className={styles.artworkGrid}>
                {(data.artworks || []).map((art) => (
                  <div key={art.id} className={styles.artworkCard}>
                    <img
                      src={getArtImage(art)}
                      alt='thumb'
                      className={styles.artworkThumb}
                    />
                    <div className={styles.artworkMeta}>
                      <div className={styles.artworkTitle}>
                        {getArtTitle(art)}
                      </div>
                      <div className={styles.artworkArtist}>
                        {getArtistName(art) || '작가 미상'}
                      </div>
                    </div>
                    <button
                      type='button'
                      className={styles.removeBtn}
                      onClick={() => handleRemoveArtwork(art.id)}
                      title='삭제'
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>홈페이지</label>
            <input
              className={styles.input}
              type='url'
              name='exhibition_homepage'
              value={data.exhibition_homepage || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>전시 소개</label>
        <TiptapEditor
          content={data.exhibition_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>

      {showArtistModal && (
        <ArtistSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelect={handleSelectArtist}
        />
      )}

      {showArtworkModal && (
        <ArtworkSelectModal
          onClose={() => setShowArtworkModal(false)}
          onSelect={handleSelectArtworks}
          existingArtworks={data.artworks || []}
        />
      )}
    </>
  );
}
