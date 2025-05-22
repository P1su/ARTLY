import React, { useEffect, useRef } from 'react';
import styles from './CatalogIndex.module.css';
import { mockCatalog } from '../mock/mockCatalog';

export default function CatalogIndex({ onSelect, currentIndex, sectionStarts, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <aside className={styles.indexContainer} ref={ref}>
      <button className={styles.closeButton} onClick={onClose}>✕</button>
      <ul className={styles.menuList}>
        {mockCatalog.map((item, idx) => (
          <li
            key={item.id}
            className={idx === currentIndex ? styles.active : ''}
            onClick={() => onSelect(sectionStarts[idx])}
            tabIndex={0}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
