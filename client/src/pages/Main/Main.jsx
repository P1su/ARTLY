import React from 'react';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Footer from '../../components/common/Footer/Footer';
import styles from './Main.module.css';

export default function Main() {
  return (
    <div className={styles.mainLayout}>
      <main className={styles.mainContent}>
        <SearchBar />
      </main>
    </div>
  );
}
