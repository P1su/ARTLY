import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';
import Img from '../../../components/Img/Img.jsx';
import { artistFilter } from '../../../utils/filters/artisFilter.js';
import { userInstance } from '../../../apis/instance.js';
import { useAlert } from '../../../store/AlertProvider.jsx';

const NATION_OPTIONS = artistFilter.find((f) => f.key === 'nation')?.options || [];

export default function ArtistEditForm({ data, setData, onFileChange, galleryId }) {
  const { showAlert } = useAlert();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [localDescription, setLocalDescription] = useState('');
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const fileInputRef = useRef(null);

  // 원본 수정 가능 여부 (내가 등록 + 나만 사용)
  const isOriginalEditable = !galleryId || data.register_gallery_id === galleryId;

  useEffect(() => {
    if (data.artist_image && typeof data.artist_image === 'string') {
      setImagePreviewUrl(data.artist_image);
    }
  }, [data.artist_image]);

  // 로컬 소개글 초기값 설정
  useEffect(() => {
    if (data.local_description !== undefined) {
      setLocalDescription(data.local_description || '');
    }
  }, [data.local_description]);

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

  // 로컬 소개글 저장
  const handleSaveLocal = async () => {
    if (!galleryId || !data.id) return;
    
    try {
      setIsSavingLocal(true);
      await userInstance.patch(`/api/artists/${data.id}/galleries/${galleryId}/local`, {
        local_description: localDescription
      });
      showAlert('갤러리 소개글이 저장되었습니다.');
    } catch (error) {
      console.error('로컬 저장 실패:', error);
      showAlert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingLocal(false);
    }
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
          disabled={!isOriginalEditable}
          style={!isOriginalEditable ? { backgroundColor: '#f0f0f0' } : {}}
        />

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          accept='image/*'
          style={{ display: 'none' }}
          disabled={!isOriginalEditable}
        />
        
        <div
          className={styles.imageUploadBox}
          onClick={() => isOriginalEditable && fileInputRef.current.click()}
          style={{ 
            borderRadius: '50%', 
            width: '20rem', 
            height: '20rem', 
            margin: '2rem auto',
            cursor: isOriginalEditable ? 'pointer' : 'default',
            opacity: isOriginalEditable ? 1 : 0.7
          }}
        >
          {imagePreviewUrl ? (
            <>
              <Img
                src={imagePreviewUrl}
                alt='작가 이미지'
                className={styles.previewImage}
                style={{ borderRadius: '50%' }}
              />
              {isOriginalEditable && (
                <button
                  className={styles.imageDelBtn}
                  type='button'
                  onClick={handleRemoveImage}
                >
                  ✕
                </button>
              )}
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
              disabled={!isOriginalEditable}
              style={!isOriginalEditable ? { backgroundColor: '#f0f0f0' } : {}}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>국적</label>
            <select
              className={styles.input}
              name="artist_nation"
              value={data.artist_nation || ''}
              onChange={handleInputChange}
              disabled={!isOriginalEditable}
              style={!isOriginalEditable ? { backgroundColor: '#f0f0f0' } : {}}
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
              disabled={!isOriginalEditable}
              style={!isOriginalEditable ? { backgroundColor: '#f0f0f0' } : {}}
            />
          </div>
        </div>

        {!isOriginalEditable && (
          <p className={styles.helperText} style={{ textAlign: 'center', marginTop: '1rem' }}>
            ※ 다른 갤러리에서 등록한 작가입니다. 기본 정보는 수정할 수 없습니다.
          </p>
        )}
      </div>

      {/* 로컬 소개글 (갤러리 컨텍스트 있을 때만) */}
      {galleryId && data.id && (
        <div className={`${styles.card} ${styles.tiptap}`}>
          <div className={styles.addHeaderContainer}>
            <label className={styles.label}>우리 갤러리 소개글</label>
            <button
              type='button'
              className={styles.addBtn}
              onClick={handleSaveLocal}
              disabled={isSavingLocal}
            >
              {isSavingLocal ? '저장 중...' : '소개글 저장'}
            </button>
          </div>
          <TiptapEditor
            content={localDescription}
            onChange={setLocalDescription}
          />
          <p className={styles.helperText}>
            ※ 이 소개글은 우리 갤러리에서만 표시됩니다.
          </p>
        </div>
      )}

      {/* 원본 소개글 */}
      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>
          {galleryId ? '원본 소개글' : '작가 소개'}
        </label>
        {isOriginalEditable ? (
          <TiptapEditor
            content={data.artist_description || ''}
            onChange={handleDescriptionChange}
          />
        ) : (
          <div 
            className={styles.readOnlyContent}
            dangerouslySetInnerHTML={{ __html: data.original_description || data.artist_description || '소개글 없음' }}
            style={{ 
              padding: '1rem', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '8px',
              minHeight: '100px',
              maxWidth: '600px',
              fontSize: '1.3rem',
              lineHeight: '1.6' 
            }}
          />
        )}
      </div>
    </>
  );
}