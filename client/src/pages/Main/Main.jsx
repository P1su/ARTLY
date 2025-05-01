import React from 'react';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import SearchBar from "../../components/common/SearchBar/SearchBar";
import Footer from '../../components/common/Footer/Footer';
import ChatbotWidget from '../../components/common/ChatbotWidget/ChatbotWidget';
import styles from './Main.module.css';

export default function Main() {
  return (
    <>
      <Header />
      <div className={styles.mainLayout}>
        <NavBar />
        <main className={styles.mainContent}>
          <h1>아뜰리</h1>
          <SearchBar />
          <br />
          메인페이지입니다.
          <br />
          <br />
          <Footer />
          <ChatbotWidget />
        </main>
      </div>
    </>
  );
}
