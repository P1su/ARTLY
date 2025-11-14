import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DocentGenerator.module.css';
import { userInstance } from '../../apis/instance';

const DocentGenerator = ({ autoGenerate = false }) => {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [docentText, setDocentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const productName = art?.art_title || '작품명';
  const artist = art?.artist_name || art?.artist?.artist_name || '작가명';
  const imageUrl = art?.art_image || 'https://images.unsplash.com/photo-1570393080660-de4e4a15a247?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fEFydHxlbnwwfHwwfHx8MA%3D%3D';

  const fetchArtDetail = async (id) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await userInstance.get(`/api/arts/${id}`);
      const payload = response.data?.data ?? response.data;
      
      if (!payload) {
        setErrorMsg('작품 정보를 찾을 수 없습니다.');
        setArt(null);
        setDocentText('');
        return;
      }
      
      setArt(payload);
      setDocentText(payload?.art_docent || '');
    } catch (e) {
      setErrorMsg(e.response?.data?.message || '작품 정보를 불러오는 중 오류가 발생했습니다.');
      setArt(null);
      setDocentText('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchArtDetail(id);
  }, [id]);

  const handleSave = async () => {
    if (!id) return alert('유효한 작품 ID가 필요합니다.');
    if (!docentText.trim()) return alert('도슨트 내용을 입력해주세요.');
    if (!art) return alert('작품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      // 업데이트할 필드들만 추가 (null이 아닌 값들만)
      if (art.art_title) formData.append('art_title', art.art_title);
      if (art.art_description) formData.append('art_description', art.art_description);
      if (art.artist_id) formData.append('artist_id', art.artist_id);
      if (art.artist_name) formData.append('artist_name', art.artist_name);
      if (art.art_material) formData.append('art_material', art.art_material);
      if (art.art_size) formData.append('art_size', art.art_size);
      if (art.art_year) formData.append('art_year', art.art_year);
      if (art.art_price) formData.append('art_price', art.art_price);
      
      // 도슨트는 항상 추가 (업데이트 대상)
      formData.append('art_docent', docentText);

      // 이미지 관련 필드들
      if (art.art_image && typeof art.art_image === 'string') {
        formData.append('art_image', art.art_image);
      }
      if (art.art_images) formData.append('art_images', art.art_images);
      if (art.art_image_mime) formData.append('art_image_mime', art.art_image_mime);
      if (art.art_image_name) formData.append('art_image_name', art.art_image_name);
      if (art.art_image_size) formData.append('art_image_size', art.art_image_size);

      const response = await userInstance.post(`/api/arts/${id}`, formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      
      alert(response.data?.message || '도슨트가 저장되었습니다.');
      await fetchArtDetail(id);
    } catch (e) {
      alert(e.response?.data?.message || '도슨트 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setDocentText(art?.art_docent || '');

  if (!id) return <div className={styles.container}>유효한 작품 ID가 없습니다.</div>;

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.guide}>작품 정보를 불러오는 중...</div>
      ) : (
        <>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={productName || '작품'}
              className={styles.image}
            />
          )}

          <div className={styles.info}>
            <div className={styles.productName}>{productName}</div>
            <div className={styles.artist}>{artist}</div>
          </div>

          {errorMsg && <div className={styles.guide} style={{ color: '#ef4444' }}>{errorMsg}</div>}

          <p className={styles.guide}>도슨트 내용을 확인하시고 수정하거나 만들어주세요.</p>

          <textarea
            className={styles.textArea}
            value={docentText}
            onChange={(e) => setDocentText(e.target.value)}
            placeholder="도슨트 내용을 입력해주세요."
            disabled={loading}
          />

          <div className={styles.buttonRow}>
            <button 
              className={styles.saveBtn} 
              onClick={handleSave}
              disabled={saving || !!errorMsg || loading}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button 
              className={styles.cancelBtn} 
              onClick={handleCancel}
              disabled={saving || loading}
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocentGenerator;