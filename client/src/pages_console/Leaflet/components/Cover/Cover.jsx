import React from 'react';
import styles from './Cover.module.css';

export default function Cover({
  coverImage,
  setCoverImage,
  openFileDialogForCover,
  coverDropzone,
}) {
  return (
    <div className={styles.coverSectionBox}>
      <div className={styles.sectionHeader}>
        <span className={styles.coverLabelSpan}>표지 이미지</span>
        <span className={styles.badge}>필수</span>
      </div>

      <div className={styles.coverWrapper}>
        {coverImage ? (
          <div className={styles.coverImageContainerBox}>
            <img
              src={coverImage.url}
              alt='표지'
              className={styles.coverImage}
            />
            <button
              className={styles.removeCoverButton}
              onClick={() => setCoverImage(null)}
              aria-label='표지 삭제'
            >
              ×
            </button>
          </div>
        ) : (
          <div
            {...coverDropzone.getRootProps()}
            className={`${styles.coverPlaceholderBox} ${coverDropzone.isDragActive ? styles.dragActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              openFileDialogForCover();
            }}
          >
            <input {...coverDropzone.getInputProps()} />
            <div className={styles.placeholderContent}>
              <span className={styles.plusIconSpan}>+</span>
              <span className={styles.placeholderText}>이미지 업로드</span>
            </div>
          </div>
        )}
      </div>
      <p className={styles.helpText}>
        리플렛의 첫 화면입니다.
        <br />
        이미지가 잘리지 않게 전체 비율로 표시됩니다.
      </p>
    </div>
  );
}
