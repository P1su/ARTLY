import React from 'react';
import styles from './Inner.module.css';

export default function Inner({ imageList, setImageList, handleImageChange, handleRemoveImage, openFileDialogForInner, innerDropzone }) {
  return (
    <div className={styles.innerPagesSectionBox}>
      <div className={styles.innerPagesLabelSpan}>
        내지 전체 {imageList.length}장
      </div>
      <div 
        {...innerDropzone.getRootProps()}
        className={`${styles.innerPagesGridContainer} ${innerDropzone.isDragActive ? styles.dragActive : ''}`}
      >
        <input {...innerDropzone.getInputProps()} />
        {imageList.map((image, index) => (
          <div key={index} className={styles.innerPageItemBox}>
            <img src={image.url} alt={image.name} className={styles.innerPageImage} />
            <button 
              className={styles.removeInnerPageButton}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <div 
          className={styles.addInnerPageButton}
          onClick={(e) => {
            e.stopPropagation();
            openFileDialogForInner();
          }}
        >
          <span className={styles.plusIconSpan}>+</span>
        </div>
      </div>
    </div>
  );
}

