import React, { useState } from 'react';
import styles from './Inner.module.css';
import useLeaflet from '../../hooks/useLeaflet';

export default function Inner({ imageList, setImageList, innerDropzone }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { handleRemoveImage, openFileDialogForInner } = useLeaflet;

  const handleDragStart = (e, index) => {
    e.stopPropagation(); // 드롭존 이벤트와 충돌 방지
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    e.currentTarget.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation(); // 드롭존 이벤트와 충돌 방지
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    // 자식 요소로 이동하는 경우는 무시
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation(); // 드롭존 이벤트와 충돌 방지

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImageList = [...imageList];
    const draggedItem = newImageList[draggedIndex];

    // 드래그된 아이템 제거
    newImageList.splice(draggedIndex, 1);

    // 드롭 위치에 삽입 (인덱스 조정)
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImageList.splice(insertIndex, 0, draggedItem);

    setImageList(newImageList);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
          <div
            key={index}
            className={`${styles.innerPageItemBox} ${draggedIndex === index ? styles.dragging : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <img
              src={image.url}
              alt={image.name}
              className={styles.innerPageImage}
            />
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
