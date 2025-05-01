import React from 'react';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import styles from './Main.module.css';

export default function Main() {
  return (
    <div className={styles.mainLayout}>
      <SearchBar />
    </div>
  );
}
