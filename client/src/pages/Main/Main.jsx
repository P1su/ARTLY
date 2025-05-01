import React from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import styles from './Main.module.css';

export default function Main() {
  return (
    <>
      <Header /> 
      <div className={styles.mainLayout}>
        <NavBar />
        <main className={styles.mainContent}>
          <h1>아뜰리</h1>
          메인페이지입니다.
        </main>
      </div>
    </>
  );
}