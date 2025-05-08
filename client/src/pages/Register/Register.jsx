import React from 'react';
import Logo from '../../components/Logo/Logo';
import InputText from '../../components/InputText/InputText';
import BtnPrimary from '../../components/BtnPrimary/BtnPrimary';
import Footer from '../../components/common/Footer/Footer';
import styles from './Register.module.css';

export default function Register() {
  return (
    <div className={styles.layout}>
      <div className={styles.contentContainer}>
        <Logo />
        <form className={styles.form}>
          <InputText placeholder="이메일" />
          <InputText placeholder="비밀번호" type="password" />
          <InputText placeholder="비밀번호 확인" type="password" />
          <InputText placeholder="이름" />
          <InputText placeholder="휴대폰 번호" />
          <BtnPrimary label="회원가입" />
        </form>
      </div>
      <Footer />
    </div>
  );
}
