import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import ArtistSelectModal from './ArtistSelectModal/ArtistSelectModal.jsx';

export default function ArtworkEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImagePreviewUrl(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (newDescription) => {
    setData((prev) => ({ ...prev, art_description: newDescription }));
  };

  // 작가 선택 콜백
  const handleSelectArtist = (artist) => {
    setData((prev) => ({
      ...prev,
      artist_name: artist.artist_name, // 화면 표시용 이름
      artist_id: artist.id, // 실제 전송될 ID
    }));
    setShowArtistModal(false);
  };

  useEffect(() => {
    if (data.art_image && typeof data.art_image === 'string') {
      setImagePreviewUrl(data.art_image);
    }
  }, [data.art_image]);

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='art_title'
          value={data.art_title || ''}
          onChange={handleInputChange}
          placeholder='작품명 입력'
        />

        <div className={styles.imageSection}>
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
            style={{ position: 'relative' }}
          >
            {imagePreviewUrl ? (
              <>
                <img
                  src={imagePreviewUrl}
                  alt='작품 이미지'
                  className={styles.previewImage}
                />
                <button
                  className={styles.imageDelBtn}
                  type='button'
                  onClick={handleRemoveImage}
                >
                  ✕
                </button>
              </>
            ) : (
              <p className={styles.previewImageDesc}>+ 작품 이미지 넣기</p>
            )}
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>전시회</label>
            <select
              className={styles.input}
              name='exhibition_id'
              value={data.exhibition_id || ''}
              onChange={handleInputChange}
            >
              <option value=''>전시회 없음</option>
              {data.exhibitions?.map((exh) => (
                <option key={exh.id} value={exh.id}>
                  {exh.exhibition_title}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>작가</label>
            <div className={styles.artistSelectRow}>
              <input
                className={styles.input}
                value={data.artist_name || ''}
                placeholder='작가를 선택해주세요'
                readOnly
                onClick={() => setShowArtistModal(true)}
                style={{ cursor: 'pointer' }}
              />
              <button
                type='button'
                className={styles.selectButton}
                onClick={() => setShowArtistModal(true)}
              >
                작가 선택
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>제작년도</label>
            <input
              type='number'
              className={styles.input}
              name='art_year'
              value={data.art_year || ''}
              onChange={handleInputChange}
              placeholder='예: 2025'
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>재료</label>
            <input
              className={styles.input}
              name='art_material'
              value={data.art_material || ''}
              onChange={handleInputChange}
              placeholder='예: Oil on canvas'
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>크기</label>
            <input
              className={styles.input}
              name='art_size'
              value={data.art_size || ''}
              onChange={handleInputChange}
              placeholder='예: 100x150cm'
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>문의 전화번호</label>
            <input
              className={styles.input}
              name='gallery_phone'
              value={data.gallery_phone || ''}
              onChange={handleInputChange}
              placeholder='예: 02-1234-5678'
            />
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>작품 설명</label>
        <TiptapEditor
          content={data.art_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.inputDocent}>
          <label className={styles.docent}>AI 도슨트 스크립트</label>
          <textarea
            className={styles.textarea}
            name='art_docent'
            value={data.art_docent || ''}
            onChange={handleInputChange}
            placeholder='AI 도슨트가 읽어줄 내용을 입력하세요.'
          />
        </div>
      </div>

      {showArtistModal && (
        <ArtistSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelect={handleSelectArtist}
        />
      )}
    </>
  );
}
