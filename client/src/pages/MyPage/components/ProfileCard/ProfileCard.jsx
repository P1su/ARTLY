import React from 'react';
import styles from './ProfileCard.module.css';
import { Link } from 'react-router-dom';
import userProfile from '../../mock/userProfile.png';

export default function ProfileCard() {
  return (
    <div className={styles.layout}>
      <div className={styles.imgBox}>
        <img src={userProfile} alt='유저 기본 프로필 이미지' />
      </div>
      <div className={styles.infoContainer}>
        <h3>아뜰리 님</h3>
        <br />
        <p>2000.10.10</p>
        <p>test@test.com</p>
        <p>010-1111-2222</p>
      </div>
      <Link to='/mypage/edit' className={styles.btnBox}>
        프로필 수정
      </Link>
    </div>
  );
}
