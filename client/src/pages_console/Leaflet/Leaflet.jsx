import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Leaflet.module.css';
import Cover from './components/Cover/Cover';
import Inner from './components/Inner/Inner';
import useImageUpload from './hooks/useImageUpload';
import { userInstance } from '../../apis/instance';
import { useConfirm } from '../../store/ConfirmProvider';
import { useAlert } from '../../store/AlertProvider';
import { FaChevronLeft } from 'react-icons/fa6';

export default function Leaflet({ type }) {
  const { id } = useParams();
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
    handleImageChange,
    handleRemoveImage,
    openFileDialogForCover,
    openFileDialogForInner,
    coverDropzone,
    innerDropzone,
  } = useImageUpload();

  // 기존 리플렛 데이터 조회
  useEffect(() => {
    const fetchLeaflet = async () => {
      try {
        setIsLoading(true);

        // Owner 모드로 통일: 카테고리와 ID로 조회
        const category =
          type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';
        const res = await userInstance.get(`/api/leaflet`, {
          params: {
            category: category,
            category_id: id,
          },
        });

        // 응답 처리
        let leafletData = null;
        if (Array.isArray(res.data)) {
          if (res.data.length > 0) {
            leafletData = res.data[0];
          }
        } else {
          leafletData = res.data;
        }

        if (leafletData) {
          setExistingLeaflet(leafletData);
          setLeafletId(leafletData.id);
          setTitle(leafletData.title || '');

          // 기존 이미지 URL을 표시
          if (leafletData.image_urls && leafletData.image_urls.length > 0) {
            // 첫 번째 이미지를 표지로 설정
            if (leafletData.image_urls[0]) {
              setCoverImage({ url: leafletData.image_urls[0] });
            }
            // 나머지 이미지를 내지로 설정
            if (leafletData.image_urls.length > 1) {
              const innerImages = leafletData.image_urls
                .slice(1)
                .map((url) => ({ url }));
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
  }, [id, type]);

  const handlePreview = () => {
    if (!leafletId) {
      showAlert('먼저 리플렛을 생성해주세요.');
    }
    const viewerUrl = `/view/leaflet/${type}/${id}`;
    window.open(viewerUrl, '_blank');
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
      showAlert('리플렛이 삭제되었습니다.');

      // 삭제 후 이동
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('리플렛 삭제 실패:', error);
      showAlert('리플렛 삭제에 실패했습니다.', 'error');
      setIsLoading(false);
    }
  };

  // 리플렛 생성
  const handleUpload = async () => {
    // 제목과 표지 이미지 필수
    if (!title.trim()) {
      showAlert('리플렛 제목을 입력해주세요.');
    }

    if (!coverImage?.file) {
      showAlert('표지 이미지를 업로드 해주세요.');
    }

    try {
      setIsLoading(true);

      // 수정 모드일 경우: 기존 리플렛 먼저 삭제
      if (leafletId && existingLeaflet) {
        await userInstance.delete(`/api/leaflet/${leafletId}`);
      }

      // 생성: POST 요청
      const formData = new FormData();

      // 표지 먼저
      formData.append('image[]', coverImage.file);

      // 내지들
      imageList.forEach((img) => {
        if (img.file) {
          formData.append('image[]', img.file);
        }
      });

      formData.append('title', title.trim());
      // category: 4개 중 택 1 (image, artCategory, exhibitionCategory, galleryCategory)
      // categoryId: 해당 카테고리의 ID
      const categoryName =
        type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';
      formData.append('category', categoryName);
      formData.append('categoryId', id); // Owner ID passed via params

      const res = await userInstance.post('/api/leaflet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showAlert('리플렛이 성공적으로 생성되었습니다.');

      // 생성 후 leafletId 업데이트 (페이지 유지)
      if (res.data.id) {
        setLeafletId(res.data.id);
        setExistingLeaflet(res.data);
      }
    } catch (error) {
      showAlert('리플렛 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = !coverImage && imageList.length === 0;

  return (
    <div className={styles.layout}>
      <div className={styles.layoutTitle}>
        리플렛 제작
        <button className={styles.backButton}>
          <FaChevronLeft />
        </button>
      </div>
      <div className={styles.mainContentContainer}>
        <div className={styles.card}>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='리플렛 제목을 입력하세요'
            className={styles.titleInput}
            disabled={isLoading}
          />
          <p className={styles.panelHeaderParagraph}>
            리플렛/도록을 만들 이미지를 등록해주세요.
            <br />
            전체 이미지를 합쳐서 하나의 책처럼 구성됩니다.
          </p>
          <Cover
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            openFileDialogForCover={openFileDialogForCover}
            coverDropzone={coverDropzone}
          />

          <Inner
            imageList={imageList}
            setImageList={setImageList}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            openFileDialogForInner={openFileDialogForInner}
            innerDropzone={innerDropzone}
          />
        </div>

        <button
          className={styles.previewButton}
          onClick={handlePreview}
          disabled={isEmpty}
        >
          미리 보기
        </button>

        <div className={styles.buttonField}>
          <button
            className={styles.createButton}
            onClick={handleUpload}
            disabled={isEmpty || isLoading}
          >
            {!leafletId ? '생성하기' : '수정하기'}
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isLoading}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
