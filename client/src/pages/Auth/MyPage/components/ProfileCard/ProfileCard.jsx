import React, { useContext } from 'react';
import styles from './ProfileCard.module.css';
import { Link } from 'react-router-dom';
import { UserContext } from './../../../../../store/UserProvider';

export default function ProfileCard() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>데이터 불러오는 중</div>;
  }
  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>마이페이지</h1>
      <Link className={styles.editLink} to='/mypage/edit'>
        {user.user_name} 님, 안녕하세요
      </Link>
    </div>
  );
}
