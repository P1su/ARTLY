import React, { useState } from 'react';
import styles from './Purchase.module.css';

export default function Purchase() {
  const [selectedPayment, setSelectedPayment] = useState('');

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    alert(`${selectedPayment}로 결제를 진행합니다.`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주문서</h2>
      <div className={styles.orderSection}>
        <p className={styles.userInfo}>
          아뜰리 님<br />
          <a href='mailto:test@email.com'>test@email.com</a>
          <br />
          010-1234-5678
        </p>

        <div className={styles.productBox}>
          <img
            src='/exhibitionImg.png'
            alt='전시 이미지'
            className={styles.productImage}
          />
          <div>
            <h3>어둠 속의 대화</h3>
            <p>2025.04.16 10:00 ~ 11:40</p>
            <p>일반, 성인: 33,000 X 2</p>
            <p>일반, 청소년: 22,000 X 1</p>
          </div>
        </div>
      </div>

      <div className={styles.paymentInfo}>
        <h3>결제 금액</h3>
        <p>상품 금액: 88,000원</p>
        <p>할인 금액: -12,000원</p>
        <p className={styles.total}>총 결제 금액: 76,000원</p>
      </div>

      <div className={styles.paymentMethod}>
        <h3>결제 수단</h3>
        <label>
          <input
            type='radio'
            name='payment'
            value='카카오페이'
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span className={styles.kakao}>카카오페이</span>
        </label>
        <label>
          <input
            type='radio'
            name='payment'
            value='네이버페이'
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span className={styles.naver}>네이버페이</span>
        </label>
        <label>
          <input
            type='radio'
            name='payment'
            value='카드 결제'
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          카드 결제
        </label>
      </div>

      <button className={styles.paymentButton} onClick={handlePayment}>
        결제하기
      </button>
    </div>
  );
}
