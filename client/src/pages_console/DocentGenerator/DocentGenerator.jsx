import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './DocentGenerator.module.css';
import { userInstance } from '../../apis/instance';
import { useAlert } from '../../store/AlertProvider';

export default function DocentGenerator({ autoGenerate = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [art, setArt] = useState(null);
  const [docentText, setDocentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [artistFile, setArtistFile] = useState(null);

  const productName = art?.art_title || '작품명';
  const artist = art?.artist_name || art?.artist?.artist_name || '작가명';
  const imageUrl =
    art?.art_image ||
    'https://images.unsplash.com/photo-1570393080660-de4e4a15a247?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fEFydHxlbnwwfHwwfHx8MA%3D%3D';

  const fetchArtDetail = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await userInstance.get(`/api/arts/${id}`);
      const data = res.data?.data ?? res.data;

      if (!data) {
        setErrorMsg('작품 정보를 찾을 수 없습니다.');
        setArt(null);
        setDocentText('');
        return;
      }

      setArt(data);
      setDocentText(data.art_docent || '');
    } catch (e) {
      setErrorMsg(
        e.response?.data?.message ||
          '작품 정보를 불러오는 중 오류가 발생했습니다.',
      );
      setArt(null);
      setDocentText('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtDetail();
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      showAlert('유효한 작품 ID가 필요합니다.');
      return;
    }

    if (!docentText.trim()) {
      showAlert('도슨트 내용을 입력해주세요.');
      return;
    }

    if (!art) {
      showAlert('작품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('art_docent', docentText);
      formData.append('generate_video', confirmChecked);

      if (artistFile) {
        formData.append('artist_image', artistFile);
      }

      await userInstance.put(`/api/arts/${id}/docent`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showAlert('도슨트가 저장되었습니다.');
      navigate(`/console/artworks/${id}`);
    } catch (e) {
      showAlert(
        e.response?.data?.message || '도슨트 저장 중 오류가 발생했습니다.',
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('취소 시 변경 정보가 저장되지 않습니다. 취소하시겠습니까?')) {
      setDocentText(art?.art_docent || '');
      navigate(`/console/artworks/${id}`);
    }
  };

  if (!id) {
    return <div className={styles.container}>유효한 작품 ID가 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.guide}>작품 정보를 불러오는 중...</div>
      ) : (
        <>
          <img src={imageUrl} alt={productName} className={styles.image} />

          <div className={styles.info}>
            <div className={styles.productName}>{productName}</div>
            <div className={styles.artist}>{artist}</div>
          </div>

          {errorMsg && (
            <div className={styles.guide} style={{ color: '#ef4444' }}>
              {errorMsg}
            </div>
          )}

          <p className={styles.guide}>
            도슨트 내용을 확인하시고 수정하거나 만들어주세요.
          </p>

          <textarea
            className={styles.textArea}
            value={docentText}
            onChange={(e) => setDocentText(e.target.value)}
            placeholder='도슨트 내용을 입력해주세요.'
            disabled={loading}
          />

          <div className={styles.checkboxBlock}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                도슨트 동영상을 생성합니다.
              </span>
            </label>

            {confirmChecked && (
              <div className={styles.expandedContent}>
                <ul className={styles.expandedList}>
                  <li>
                    저장 후 동영상 생성까지 수십 초에서 수 분이 소요될 수
                    있습니다.
                  </li>
                  <li>
                    생성된 동영상은 작품 관리 페이지에서 확인할 수 있습니다.
                  </li>
                  <li>
                    음성 도슨트를 재생성해도 동영상은 자동 갱신되지 않습니다.
                  </li>
                </ul>

                <div className={styles.fileInputArea}>
                  <label className={styles.fileInputLabel}>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) =>
                        setArtistFile(e.target.files?.[0] || null)
                      }
                      className={styles.fileInput}
                    />
                  </label>
                  {artistFile && (
                    <div className={styles.fileName}>{artistFile.name}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.buttonRow}>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving || loading || !!errorMsg}
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
}
