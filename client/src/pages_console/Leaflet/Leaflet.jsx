import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import styles from './Leaflet.module.css';
import Cover from './components/Cover/Cover';
import Inner from './components/Inner/Inner';
import Preview from './components/Preview/Preview';
import useImageUpload from './hooks/useImageUpload';

export default function Leaflet() {
  const [showBookletViewer, setShowBookletViewer] = useState(false);
  
  // 훅 사용
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
    innerDropzone
  } = useImageUpload();

  // 미리보기 핸들러
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

  return (
    <div className={styles.layout}>
      <Toaster />
      {/* 메인 콘텐츠 */}
      <div className={styles.mainContentContainer}>
        <div className={styles.panelHeaderBox}>
          <p className={styles.panelHeaderParagraph}>리플렛/도록을 만들 이미지를 등록해주세요.<br />전체 이미지를 합쳐서 하나의 책처럼 구성됩니다.</p>
        </div>

        {/* 표지 등록 영역 */}
        <Cover 
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          openFileDialogForCover={openFileDialogForCover}
          coverDropzone={coverDropzone}
        />

        {/* 내지 등록 영역 */}
        <Inner 
          imageList={imageList}
          setImageList={setImageList}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          openFileDialogForInner={openFileDialogForInner}
          innerDropzone={innerDropzone}
        />

        {/* 하단 버튼들 */}
        <div className={styles.combinedButtonBox}>
          <button 
            className={styles.leftButton}
            onClick={handlePreview}
            disabled={!coverImage && imageList.length === 0}
          >
            미리보기
          </button>
          <div className={styles.dividerBox}></div>
          <button className={styles.rightButton}>QR보기</button>
        </div>
      </div>


      {/* 도록 뷰어 */}
      <Preview 
        isOpen={showBookletViewer}
        onClose={() => setShowBookletViewer(false)}
        coverImage={coverImage}
        imageList={imageList}
      />
    </div>
  );
}
