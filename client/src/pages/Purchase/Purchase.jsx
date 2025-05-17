import React, { useState } from 'react';
import styles from './Purchase.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function Purchase() {
  const { reservationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('');

  const {
    exhibition = {},
    date = '',
    time = '',
    people: { adults = 0, teens = 0, children = 0 } = {},
    total = 0,
    email = 'test@test.com',
    phone = '010-1234-5678',
    name = '아뜰리',
  } = state || {};

  const handleBack = () => navigate(`/reservation/${exhibition.id}`);

  const handlePayment = () => {
    if (!selectedPayment) {
      alert('결제 수단을 선택해주세요.');
      return;
    }
    alert(`${selectedPayment}로 결제를 진행합니다.`);

    const people = { adults, teens, children };
    const reservationData = {
      ...state,
      payment: selectedPayment,
    };
    navigate(`/reservation/complete/${reservationId}`, {
      state: reservationData,
    });
  };

  const renderUserInfo = () => (
    <div className={styles.userInfo}>
      <h3>예매 정보</h3>
      <p>{name} 님</p>
      <p>{email}</p>
      <p>{phone}</p>
    </div>
  );

  const renderProductInfo = () => (
    <div className={styles.productBox}>
      <img
        src={exhibition.imageUrl}
        alt='전시 이미지'
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <h3>{exhibition.title}</h3>
        <p>- 방문일 : {date}</p>
        <p>- 예매 시간 : {time}</p>
        <p>
          - 인원 : 성인 {adults}, 청소년 {teens}, 유아 {children}
        </p>
        <p>- 가격 : {total.toLocaleString()}원</p>
      </div>
    </div>
  );

  const renderDiscountInfo = () => (
    <div className={styles.discountInfo}>
      <h3>할인 및 포인트 사용</h3>
      <p>1,000point 차감</p>
      <p>할인 금액: 0원</p>
    </div>
  );

  const renderPaymentInfo = () => (
    <div className={styles.paymentInfo}>
      <h3>결제 금액</h3>
      <p>상품 금액: {total.toLocaleString()}원</p>
      <p>할인 금액: -1,000원</p>
      <p className={styles.total}>
        총 결제 금액: {(total - 1000).toLocaleString()}원
      </p>
    </div>
  );

  const renderPaymentMethods = () => {
    const paymentMethods = {
      카카오페이: 'kakao',
      네이버페이: 'naver',
      '카드 결제': 'basic',
    };

    return (
      <div className={styles.paymentMethod}>
        <h3>결제 수단</h3>
        {Object.entries(paymentMethods).map(([methodName, styleClass]) => (
          <label key={methodName}>
            <input
              type='radio'
              name='payment'
              value={methodName}
              onChange={(e) => setSelectedPayment(e.target.value)}
            />
            <span className={styles[styleClass]}> {methodName}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          &larr;
        </button>
        <span className={styles.title}>예매 확인 및 결제</span>
      </header>

      <div className={styles.orderSection}>
        {renderUserInfo()}
        {renderProductInfo()}
      </div>

      {renderDiscountInfo()}
      {renderPaymentInfo()}
      {renderPaymentMethods()}

      <button className={styles.paymentButton} onClick={handlePayment}>
        결제하기
      </button>
    </div>
  );
}
