import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import styles from './Leaflet.module.css';
import Cover from './components/Cover/Cover';
import Inner from './components/Inner/Inner';
import Preview from './components/Preview/Preview';
import useImageUpload from './hooks/useImageUpload';
import { userInstance } from '../../apis/instance';

export default function Leaflet() {
  const [showBookletViewer, setShowBookletViewer] = useState(false);

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

  const handlePreview = () => {
    if (!coverImage) {
      toast.error('표지 이미지를 먼저 업로드해주세요!', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }
    setShowBookletViewer(true);
  };

  // 이미지 여러 장 한 번에 업로드
  const handleUpload = async () => {
    if (!coverImage) {
      toast.error('표지를 업로드해주세요!');
      return;
    }

    if (!coverImage.file) {
      toast.error('표지 파일 정보가 없습니다.');
      return;
    }

    if (imageList.some((img) => !img.file)) {
      toast.error('내지 이미지 파일 정보가 없습니다.');
      return;
    }

    try {
      const formData = new FormData();

      // ✅ 백엔드 스펙: field 이름이 image 인 상태에서 배열로 받는 경우
      // 표지 먼저
      formData.append('image', coverImage.file);

      // 내지들
      imageList.forEach((img) => {
        formData.append('image', img.file);
      });

      // 필요하면 category도 같이 전송 (백엔드에서 안 써도 상관 없음)
      formData.append('category', 'LEAFLET');

      const res = await userInstance.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('업로드 응답:', res.data);
      toast.success('이미지가 성공적으로 업로드되었습니다!', {
        position: 'top-center',
      });
    } catch (error) {
      console.error('업로드 오류:', error);
      toast.error('이미지 업로드 중 오류가 발생했습니다.', {
        position: 'top-center',
      });
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
            미리보기
          </button>

          <div className={styles.dividerBox}></div>

          <button
            className={styles.rightButton}
            onClick={handleUpload}
            disabled={isEmpty}
          >
            업로드
          </button>
        </div>
      </div>

      <Preview
        isOpen={showBookletViewer}
        onClose={() => setShowBookletViewer(false)}
        coverImage={coverImage}
        imageList={imageList}
      />
    </div>
  );
}
