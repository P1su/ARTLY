import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Leaflet.module.css';

// 컴포넌트 import
import Cover from './components/Cover/Cover';
import Inner from './components/Inner/Inner';
import useLeaflet from './hooks/useLeaflet';
import { userInstance } from '../../apis/instance';

import { useConfirm } from '../../store/ConfirmProvider';
import { useAlert } from '../../store/AlertProvider';
import { FaChevronLeft } from 'react-icons/fa6';

// 업로드 용량 제한 (MB)
const MAX_TOTAL_SIZE_MB = 50;

export default function Leaflet({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  const [leafletId, setLeafletId] = useState(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingLeaflet, setExistingLeaflet] = useState(null);

  const {
    imageList,
    setImageList,
    coverImage,
    setCoverImage,
    coverDropzone,
    innerDropzone,
    openFileDialogForCover,
    openFileDialogForInner,
    handleRemoveImage,
  } = useLeaflet();

  const goBack = () => {
    navigate(`/console/${type}/${id}`);
  };

  // 리플렛 조회
  useEffect(() => {
    const fetchLeaflet = async () => {
      try {
        setIsLoading(true);
        const category =
          type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';

        const res = await userInstance.get(`/api/leaflet`, {
          params: { category, category_id: id },
        });

        let leafletData = null;
        if (Array.isArray(res.data)) {
          if (res.data.length > 0) leafletData = res.data[0];
        } else {
          leafletData = res.data;
        }

        if (leafletData) {
          setExistingLeaflet(leafletData);
          setLeafletId(leafletData.id);
          setTitle(leafletData.title || '');

          if (leafletData.image_urls && leafletData.image_urls.length > 0) {
            if (leafletData.image_urls[0]) {
              setCoverImage({
                url: leafletData.image_urls[0],
                file: null,
                isNew: false,
              });
            }
            if (leafletData.image_urls.length > 1) {
              const innerImages = leafletData.image_urls
                .slice(1)
                .map((url) => ({
                  url,
                  file: null,
                  isNew: false,
                }));
              setImageList(innerImages);
            }
          }
        }
      } catch (error) {
        console.error('리플렛 조회 실패:', error);
        if (error.response?.status !== 404) {
          showAlert('리플렛 데이터를 불러오는데 실패했습니다.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaflet();
  }, [id, type, setCoverImage, setImageList]);

  const handlePreview = () => {
    if (!leafletId) {
      showAlert('먼저 리플렛을 생성해주세요!');
      return;
    }
    navigate(`/view/leaflet/${type}/${id}`);
  };

  const handleDelete = async () => {
    if (!leafletId) return;

    const isConfirmed = await showConfirm(
      '정말로 이 리플렛을 삭제하시겠습니까?',
      true,
    );

    if (!isConfirmed) return;

    try {
      setIsLoading(true);
      await userInstance.delete(`/api/leaflet/${leafletId}`);

      setLeafletId(null);
      setExistingLeaflet(null);
      setTitle('');
      setCoverImage(null);
      setImageList([]);

      showAlert('리플렛이 삭제되었습니다.');
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('리플렛 삭제 실패:', error);
      showAlert('리플렛 삭제에 실패했습니다.', 'error');
      setIsLoading(false);
    }
  };

  /**
   * [통합 업로드 핸들러] - CORS 우회 버전
   * 새 파일은 FormData로, 기존 URL은 JSON 문자열로 전송
   */
  const handleUpload = async () => {
    if (!title.trim()) {
      showAlert('리플렛 제목을 입력해주세요!');
      return;
    }
    if (!coverImage) {
      showAlert('표지 이미지를 업로드해주세요!');
      return;
    }

    // ===== 용량 체크 =====
    const allItemsForSizeCheck = [coverImage, ...imageList];
    const totalSize = allItemsForSizeCheck.reduce((sum, item) => {
      if (item.file) return sum + item.file.size;
      return sum;
    }, 0);
    const totalMB = totalSize / (1024 * 1024);

    if (totalMB > MAX_TOTAL_SIZE_MB) {
      showAlert(
        `업로드 용량 제한(${MAX_TOTAL_SIZE_MB}MB)을 초과했습니다.\n현재: ${totalMB.toFixed(1)}MB`,
        'error'
      );
      return;
    }
    // ===== 용량 체크 끝 =====

    try {
      setIsLoading(true);

      const categoryName =
        type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';

      // 전체 이미지 목록 (표지 + 내지 순서대로)
      const allItems = [coverImage, ...imageList];

      // 새 파일 여부 확인
      const hasNewFile = allItems.some((item) => item.file);

      // --- CASE 1: 순서만 바꾸거나 텍스트만 수정 (새 파일 없음) ---
      if (leafletId && existingLeaflet && !hasNewFile) {
        console.log('단순 정보/순서 변경 -> PATCH');

        const orderedImageUrls = allItems.map((item) => item.url);

        await userInstance.patch(`/api/leaflet/${leafletId}`, {
          title: title.trim(),
          category: categoryName,
          image_urls: orderedImageUrls,
        });

        showAlert('리플렛 정보가 수정되었습니다!');
        return;
      }

      // --- CASE 2: 파일 추가/삭제/변경 ---
      console.log('이미지 변경 감지 -> 혼합 업로드 시작');

      const formData = new FormData();
      
      // 이미지 순서 정보 (인덱스별로 새 파일인지 기존 URL인지)
      const imageOrder = [];
      let newFileIndex = 0;

      allItems.forEach((item, index) => {
        if (item.file) {
          // 새 파일: FormData에 추가
          formData.append('image[]', item.file);
          imageOrder.push({ type: 'new', index: newFileIndex });
          newFileIndex++;
        } else if (item.url) {
          // 기존 URL: 순서 정보에 URL 포함
          imageOrder.push({ type: 'existing', url: item.url });
        }
      });

      formData.append('title', title.trim());
      formData.append('category', categoryName);
      formData.append('categoryId', id);
      formData.append('image_order', JSON.stringify(imageOrder));

      // 기존 리플렛 ID가 있으면 전달 (백엔드에서 삭제 처리)
      if (leafletId) {
        formData.append('old_leaflet_id', leafletId);
      }

      const res = await userInstance.post('/api/leaflet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data && res.data.id) {
        const newLeafletId = res.data.id;

        let imageUrls = res.data.image_urls;
        if (typeof imageUrls === 'string') {
          imageUrls = JSON.parse(imageUrls);
        }

        setLeafletId(newLeafletId);
        setExistingLeaflet(res.data);

        if (imageUrls?.length > 0) {
          setCoverImage({ url: imageUrls[0], file: null, isNew: false });

          if (imageUrls.length > 1) {
            setImageList(
              imageUrls.slice(1).map((url) => ({
                url,
                file: null,
                isNew: false,
              }))
            );
          } else {
            setImageList([]);
          }
        }
        showAlert('리플렛이 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('리플렛 저장 오류:', error);
      showAlert('리플렛 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const patchLeaflet = async () => {
    try {
      const payload = {
        title: title.trim(),
        //image_urls: imageList.map((img) => img.url),
      };

      const res = await userInstance.patch(
        `/api/leaflet/${leafletId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      showAlert('리플렛이 성공적으로 수정되었습니다.');

      setLeafletId(res.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const isEmpty = !coverImage && imageList.length === 0;

  return (
    <div className={styles.layout}>
      <div className={styles.layoutTitle}>
        리플렛 제작
        <button
          className={styles.backButton}
          onClick={() => {
            navigate(-1);
          }}
        >
          <FaChevronLeft />
        </button>
      </div>
      <div className={styles.mainContentContainer}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>리플렛 제목</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목을 입력해주세요.'
              className={styles.textInput}
              disabled={isLoading}
            />
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <Cover
                coverImage={coverImage}
                setCoverImage={setCoverImage}
                openFileDialogForCover={openFileDialogForCover}
                coverDropzone={coverDropzone}
              />
            </div>

            <div className={styles.rightColumn}>
              <Inner
                imageList={imageList}
                setImageList={setImageList}
                // handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                openFileDialogForInner={openFileDialogForInner}
                innerDropzone={innerDropzone}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionFooter}>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.actionButton} ${styles.previewBtn}`}
              onClick={handlePreview}
              disabled={isEmpty}
            >
              미리보기
            </button>

            {!leafletId ? (
              <button
                className={`${styles.actionButton} ${styles.submitBtn}`}
                onClick={handleUpload}
                disabled={isEmpty || isLoading}
              >
                {isLoading ? '생성 중...' : '리플렛 생성하기'}
              </button>
            ) : (
              <div className={styles.editModeButtons}>
                <button
                  className={`${styles.actionButton} ${styles.submitBtn}`}
                  onClick={handleUpload}
                  disabled={isEmpty || isLoading}
                >
                  {isLoading ? '저장 중...' : '수정사항 저장'}
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteBtn}`}
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}