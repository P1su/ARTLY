import React from 'react';
import styles from './SectionTitle.module.css';

export default function SectionTitle({ title }) {
  return <p className={styles.titleParagraph}>{title}</p>;
}
