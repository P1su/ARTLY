import React from 'react';
import Header from '../../components/Header/Header';
import Logo from '../../components/Logo/Logo';
import InputText from '../../components/InputText/InputText';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';
import Footer from '../../components/common/Footer/Footer';
import ChatbotWidget from '../../components/common/ChatbotWidget/ChatbotWidget';
import styles from './Login.module.css';

export default function Login() {
  return (
    <div className={styles.loginLayout}>
      <div className={styles.contentWrapper}>
        <Logo />
        <form className={styles.form}>
          <InputText placeholder="아이디" />
          <InputText placeholder="비밀번호" />
          <BtnPrimary label="Login" />
        </form>
      </div>

      <Footer />
    </div>
  );
}
