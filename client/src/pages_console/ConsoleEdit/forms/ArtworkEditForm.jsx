import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import ArtistSelectModal from './ArtistSelectModal/ArtistSelectModal.jsx';

export default function ArtworkEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const fileInputRef = useRef(null);

  /** 🖼 대표 이미지 업로드 */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  /** 입력값 변경 */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  /** 설명 변경 */
  const handleDescriptionChange = (newDescription) => {
    setData((prev) => ({ ...prev, art_description: newDescription }));
  };

  /** 기존 이미지 불러오기 */
  useEffect(() => {
    if (data.art_image && typeof data.art_image === 'string') {
      setImagePreviewUrl(data.art_image);
    }
  }, [data.art_image]);

  return (
    <>
      <div className={styles.card}>
        {/* 🎨 작품 이미지 */}
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
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt='작품 이미지'
                className={styles.previewImage}
              />
            ) : (
              <p className={styles.previewImageDesc}>+ 작품 이미지 넣기</p>
            )}
          </div>
        </div>

        {/* 🖋 작품명 */}
        <input
          className={styles.input}
          name='art_title'
          value={data.art_title || ''}
          onChange={handleInputChange}
          placeholder='작품명 입력'
        />

        {/* 🏛 전시회 선택 (data.exhibitions 배열 사용) */}
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

        {/* 👩‍🎨 작가 선택 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>작가</label>
          <div className={styles.artistSelectRow}>
            <input
              className={styles.input}
              name='artist_name'
              value={data.artist_name || ''}
              placeholder='선택된 작가'
              readOnly
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

        {/* 🗓 제작년도 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>제작년도</label>
          <input
            type='number'
            className={styles.input}
            name='art_year'
            value={data.art_year || ''}
            onChange={handleInputChange}
            placeholder='예: 2023'
          />
        </div>

        {/* 🎨 재료 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>재료</label>
          <input
            className={styles.input}
            name='art_material'
            value={data.art_material || ''}
            onChange={handleInputChange}
            placeholder='예: 유화, 캔버스 등'
          />
        </div>

        {/* 📏 크기 */}
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

        {/* 💰 가격 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>가격</label>
          <div className={styles.priceInputContainer}>
            <input
              type='number'
              className={styles.input}
              name='art_price'
              value={data.art_price || ''}
              onChange={handleInputChange}
              placeholder='예: 2000000'
            />
          </div>
        </div>

        {/* 📝 작품 설명 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>작품 설명</label>
          <TiptapEditor
            content={data.art_description || ''}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* 🤖 AI 도슨트 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>AI 도슨트</label>
          <textarea
            className={styles.textarea}
            name='art_docent'
            value={data.art_docent || ''}
            onChange={handleInputChange}
            placeholder='AI 도슨트 내용을 입력하세요.'
          />
        </div>
      </div>

      {/* 👩‍🎨 작가 선택 모달 */}
      {showArtistModal && (
        <ArtistSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelect={(artist) =>
            setData((prev) => ({
              ...prev,
              artist_name: artist.name,
              artist_id: artist.id,
            }))
          }
          setData={setData}
        />
      )}
    </>
  );
}
