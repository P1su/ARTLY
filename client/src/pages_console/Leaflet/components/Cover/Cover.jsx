import React from 'react';
import styles from './Cover.module.css';

export default function Cover({ coverImage, setCoverImage, openFileDialogForCover, coverDropzone }) {
  return (
    <div className={styles.coverSectionBox}>
      <div className={styles.coverLabelSpan}>표지</div>
      <div className={styles.coverAreaBox}>
        {coverImage ? (
          <div className={styles.coverImageContainerBox}>
            <img src={coverImage.url} alt="표지" className={styles.coverImage} />
            <button 
              className={styles.removeCoverButton}
              onClick={() => setCoverImage(null)}
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
            <span className={styles.plusIconSpan}>+</span>
          </div>
        )}
      </div>
    </div>
  );
}
