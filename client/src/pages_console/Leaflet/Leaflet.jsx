import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Leaflet.module.css';
import Cover from './components/Cover/Cover';
import Inner from './components/Inner/Inner';
import useImageUpload from './hooks/useImageUpload';
import { userInstance } from '../../apis/instance';

export default function Leaflet({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
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
        const category = type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';
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
              const innerImages = leafletData.image_urls.slice(1).map(url => ({ url }));
              setImageList(innerImages);
            }
          }
        }
      } catch (error) {
        console.error('리플렛 조회 실패:', error);
        // 404는 리플렛이 없는 경우이므로 에러 처리하지 않음 (생성 모드)
        if (error.response?.status !== 404) {
          toast.error('리플렛 데이터를 불러오는데 실패했습니다.', {
            position: 'top-center',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaflet();
  }, [id, type]);

  const handlePreview = () => {
    if (!leafletId) {
      toast.error('먼저 리플렛을 생성해주세요!', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }
    const viewerUrl = `/view/leaflet/${type}/${id}`;
    window.open(viewerUrl, '_blank');
  };



  const handleDelete = async () => {
    if (!leafletId) return;

    if (!window.confirm('정말로 이 리플렛을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsLoading(true);
      await userInstance.delete(`/api/leaflet/${leafletId}`);
      toast.success('리플렛이 삭제되었습니다.', {
        position: 'top-center',
      });

      // 삭제 후 이동
      // 항상 Owner 상세 페이지로 이동
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('리플렛 삭제 실패:', error);
      toast.error('리플렛 삭제에 실패했습니다.', {
        position: 'top-center',
      });
      setIsLoading(false);
    }
  };

  // 리플렛 생성
  const handleUpload = async () => {
    // 제목과 표지 이미지 필수
    if (!title.trim()) {
      toast.error('리플렛 제목을 입력해주세요!', {
        position: 'top-center',
      });
      return;
    }

    if (!coverImage?.file) {
      toast.error('표지 이미지를 업로드해주세요!', {
        position: 'top-center',
      });
      return;
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
      const categoryName = type === 'galleries' ? 'galleryCategory' : 'exhibitionCategory';
      formData.append('category', categoryName);
      formData.append('categoryId', id); // Owner ID passed via params

      const res = await userInstance.post('/api/leaflet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('리플렛이 성공적으로 생성되었습니다!', {
        position: 'top-center',
      });

      // 생성 후 leafletId 업데이트 (페이지 유지)
      if (res.data.id) {
        setLeafletId(res.data.id);
        setExistingLeaflet(res.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || '리플렛 저장 중 오류가 발생했습니다.';
      toast.error(errorMessage, {
        position: 'top-center',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = !coverImage && imageList.length === 0;

  return (
    <div className={styles.layout}>
      <Toaster />

      <div className={styles.mainContentContainer}>
        <div className={styles.panelHeaderBox}>
          <p className={styles.panelHeaderParagraph}>
            리플렛/도록을 만들 이미지를 등록해주세요.<br />
            전체 이미지를 합쳐서 하나의 책처럼 구성됩니다.
          </p>
        </div>

        <div className={styles.titleInputBox}>
          <label className={styles.titleLabel}>리플렛 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="리플렛 제목을 입력하세요"
            className={styles.titleInput}
            disabled={isLoading}
          />
        </div>

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

        <div className={styles.combinedButtonBox}>
          <button
            className={styles.leftButton}
            onClick={handlePreview}
            disabled={isEmpty}
          >
            리플렛/도록 보기
          </button>

          {!leafletId ? (
            <button
              className={styles.rightButton}
              onClick={handleUpload}
              disabled={isEmpty || isLoading}
            >
              {isLoading ? '처리 중...' : '생성'}
            </button>
          ) : (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isLoading}
            >
              삭제
            </button>
          )}
        </div>
      </div>

    </div >
  );
}
