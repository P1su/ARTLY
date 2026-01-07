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

export default function Leaflet({ type }) {
  const { id } = useParams(); // *주의: 이것은 categoryId (전시/갤러리 ID)*
  const navigate = useNavigate();

  const { showConfirm } = useConfirm();
  const { showAlert } = useAlert();

  // id는 항상 Owner(Gallery/Exhibition) ID입니다.
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
            // 표지
            if (leafletData.image_urls[0]) {
              setCoverImage({
                url: leafletData.image_urls[0],
                file: null,
                isNew: false,
              });
            }
            // 내지
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

        // 404는 리플렛이 없는 경우이므로 에러 처리하지 않음 (생성 모드)
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

      // 상태 초기화 추가
      setLeafletId(null);
      setExistingLeaflet(null);
      setTitle('');
      setCoverImage(null);
      setImageList([]);

      showAlert('리플렛이 삭제되었습니다.');

      // 삭제 후 이동
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('리플렛 삭제 실패:', error);
      showAlert('리플렛 삭제에 실패했습니다.', 'error');
      setIsLoading(false);
    }
  };

  /**
   * [이미지 변환 함수]
   * URL을 File 객체로 변환합니다. 캐시 문제 방지 및 에러 핸들링 강화.
   */
  const convertUrlToFile = async (url, index) => {
    try {
      // 캐시 방지를 위해 타임스탬프 추가
      const fetchUrl = url.includes('?')
        ? `${url}&t=${Date.now()}`
        : `${url}?t=${Date.now()}`;

      const response = await fetch(fetchUrl, { mode: 'cors' });

      if (!response.ok) {
        throw new Error(`이미지 로드 실패: ${response.status}`);
      }

      const blob = await response.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      // 파일명 충돌 방지를 위해 고유 이름 생성
      const fileName = `reupload_${Date.now()}_${index}.${ext}`;

      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error(`이미지(${url}) 변환 중 오류:`, error);
      return null; // 실패 시 null 반환
    }
  };

  /**
   * [통합 업로드 핸들러]
   * 전략:
   * 1. 단순 텍스트/순서 변경만 있고 새 파일이 없다면 -> PATCH (가볍게 처리)
   * 2. 파일 추가/삭제 등 복잡한 수정이라면 ->
   * (1) 모든 이미지(URL 포함)를 File 객체로 완벽 변환
   * (2) 변환 실패 검사 (누락 방지)
   * (3) 새 리플렛 생성 (POST)
   * (4) 성공 시 기존 리플렛 삭제 (DELETE)
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

    try {
      setIsLoading(true);

      const categoryName =
        type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';

      // 전체 이미지 목록 (표지 + 내지 순서대로)
      const allItems = [coverImage, ...imageList];

      // 새 파일(업로드한 파일)이 하나라도 있는지 확인
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

      // --- CASE 2: 파일 추가/삭제/변경 (POST 후 DELETE 전략) ---
      console.log('이미지 변경 감지 -> 전체 재생성 프로세스 시작');

      // 1. 모든 이미지를 File 객체로 준비
      const filePromises = allItems.map(async (item, index) => {
        if (item.file) return item.file; // 이미 파일이면 OK
        return await convertUrlToFile(item.url, index); // URL이면 변환
      });

      const files = await Promise.all(filePromises);

      // 2. 변환 실패(null) 확인 - 여기서 이미지가 누락되는지 체크
      const validFiles = files.filter((f) => f !== null);

      if (validFiles.length !== allItems.length) {
        // 원래 개수와 변환된 개수가 다르면, 일부 이미지를 불러오지 못한 것임
        // 여기서 저장을 멈춰야 이미지가 사라지는 것을 막을 수 있음
        console.error('변환 실패한 이미지가 있습니다.');
        showAlert(
          '기존 이미지를 불러오는 데 실패했습니다. 네트워크 상태를 확인하거나 이미지를 다시 올려주세요.',
        );
        setIsLoading(false);
        return;
      }

      // 3. FormData 생성
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('image[]', file);
      });
      formData.append('title', title.trim());
      formData.append('category', categoryName);
      formData.append('categoryId', id);

      // 4. [중요] 새 리플렛 생성 (POST)
      const res = await userInstance.post('/api/leaflet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 5. 생성 성공 시, 기존 리플렛 삭제 (DELETE)
      // *생성이 실패하면 여기까지 안 오므로 데이터는 안전함*
      if (res.data && res.data.id) {
        const newLeafletId = res.data.id;

        if (leafletId) {
          try {
            console.log(
              `새 리플렛(${newLeafletId}) 생성 완료. 구 리플렛(${leafletId}) 삭제 시도.`,
            );
            await userInstance.delete(`/api/leaflet/${leafletId}`);
          } catch (delError) {
            console.warn('기존 리플렛 삭제 실패 (무시):', delError);
            // 삭제 실패해도 새건 만들어졌으니 큰 문제는 아님
          }
        }

        // image_urls가 문자열이면 파싱
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
