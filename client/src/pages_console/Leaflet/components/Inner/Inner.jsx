import React, { useState } from 'react';
import styles from './Inner.module.css';

export default function Inner({
  imageList,
  setImageList,

  innerDropzone,
  handleRemoveImage,
  openFileDialogForInner,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    if (draggedIndex === null) return;

    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const listWithoutItem = imageList.filter((_, i) => i !== draggedIndex);
    listWithoutItem.splice(dropIndex, 0, imageList[draggedIndex]);

    setImageList(listWithoutItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={styles.innerPagesSectionBox}>
      <div className={styles.headerRow}>
        <span className={styles.innerPagesLabelSpan}>내지 이미지</span>
        <span className={styles.countBadge}>{imageList.length}장</span>
      </div>
      <div
        {...innerDropzone.getRootProps()}
        className={`${styles.innerPagesGridContainer} ${innerDropzone.isDragActive ? styles.dropzoneActive : ''}`}
      >
        <input {...innerDropzone.getInputProps()} />

        {imageList.map((image, index) => (
          <div
            key={image.url}
            className={`
              ${styles.innerPageItemBox} 
              ${draggedIndex === index ? styles.dragging : ''} 
              ${dragOverIndex === index ? styles.dragOver : ''}
            `}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={image.url}
                alt={`내지 ${index + 1}`}
                className={styles.innerPageImage}
              />
            </div>

            <div className={styles.pageNumberBadge}>{index + 1}</div>

            {/* =======
            <img
              src={image.url}
              alt={image.name}
              className={styles.innerPageImage}
            />
>>>>>>> develop */}
            <button
              className={styles.removeInnerPageButton}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
              title='삭제'
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
          <span className={styles.addText}>추가하기</span>
        </div>
      </div>
    </div>
  );
}
