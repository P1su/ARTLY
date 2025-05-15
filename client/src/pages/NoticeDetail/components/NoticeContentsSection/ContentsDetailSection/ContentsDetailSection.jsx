import React from 'react';
import styles from './ContentsDetailSection.module.css';

export default function ContentsDetailSection({ content }) {
  return (
    <div className={styles.contentsDetail}>
      <h2 className={styles.heading}>공모내용</h2>
      {content.split('\n').map((line, idx) =>
        line.trim() ? <p key={idx}>{line}</p> : <br key={idx} />
      )}
    </div>
  );
}
