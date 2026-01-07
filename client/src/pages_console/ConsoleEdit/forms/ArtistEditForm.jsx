import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import Img from '../../../components/Img/Img.jsx';
import { artistFilter } from '../../../utils/filters/artisFilter.js';

const NATION_OPTIONS = artistFilter.find((f) => f.key === 'nation')?.options || [];

export default function ArtistEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data.artist_image && typeof data.artist_image === 'string') {
      setImagePreviewUrl(data.artist_image);
    }
  }, [data.artist_image]);

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
    setData((prev) => ({ ...prev, artist_description: newDescription }));
  };

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='artist_name'
          value={data.artist_name || ''}
          onChange={handleInputChange}
          placeholder='작가명 입력'
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
          style={{ borderRadius: '50%', width: '20rem', height: '20rem', margin: '2rem auto' }}
        >
          {imagePreviewUrl ? (
            <>
              <Img
                src={imagePreviewUrl}
                alt='작가 이미지'
                className={styles.previewImage}
                style={{ borderRadius: '50%' }}
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
            <p className={styles.previewImageDesc}>+ 작가 사진</p>
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>분야</label>
            <input
              className={styles.input}
              name='artist_category'
              value={data.artist_category || ''}
              onChange={handleInputChange}
              placeholder='예: 회화, 조각, 설치미술'
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>국적</label>
            <select
              className={styles.input}
              name="artist_nation"
              value={data.artist_nation || ''}
              onChange={handleInputChange}
            >
              {NATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>홈페이지</label>
            <input
              className={styles.input}
              type='url'
              name='artist_homepage'
              value={data.artist_homepage || ''}
              onChange={handleInputChange}
              placeholder='https://...'
            />
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>작가 소개</label>
        <TiptapEditor
          content={data.artist_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>
    </>
  );
}