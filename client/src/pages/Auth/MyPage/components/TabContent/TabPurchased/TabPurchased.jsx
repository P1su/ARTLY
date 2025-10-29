import React, { useEffect, useState } from 'react';
import { userInstance } from '../../../../../../apis/instance';
import SectionCard from '../../SectionCard/SectionCard';
import styles from './TabPurchased.module.css';
import { useNavigate } from 'react-router-dom';

export default function TabPurchased() {
  const [purchased, setPurchased] = useState([]);
  const navigate = useNavigate();

  const handleOpenQRScanner = () => {
    navigate('/scan');
  };

  const handleGoDetail = (id) => {
    navigate(`/catalog/${id}`);
  };

  const handleQR = () => {
    console.log('QR 보기 or 스캔');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await userInstance.get('/api/users/me/purchases');
        const purchases = res.data;

        const detailedPurchases = await Promise.all(
          purchases.map(async (item) => {
            try {
              const bookDetailRes = await userInstance.get(
                `/api/books/${item.book_id}`,
              );
              return {
                ...item,
                bookDetail: bookDetailRes.data,
              };
            } catch (err) {
              console.error(
                `Book ${item.book_id} 상세 정보 가져오기 실패: `,
                err,
              );
              return {
                ...item,
                bookDetail: null,
              };
            }
          }),
        );

        console.log(detailedPurchases);
        setPurchased(detailedPurchases);
      } catch (err) {
        console.error('구매 목록 가져오기 실패: ', err);
        setPurchased([]);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={styles.myCatalog}>
      <div className={styles.header}>
        <div>
          <p className={styles.countText}>
            등록된 도록 <span className={styles.count}>{purchased.length}</span>
          </p>
        </div>
        <button
          className={styles.registerCatalogBtn}
          onClick={handleOpenQRScanner}
        >
          구매한 도록 등록하기
        </button>
      </div>

      <section>
        <div className={styles.cardList}>
          {purchased.length > 0 ? (
            purchased.map((item) => (
              <SectionCard
                key={item.id}
                item={item}
                onGoDetail={() => handleGoDetail(item.id)}
                onQR={handleQR}
                onCancel={null}
                type='catalog'
              />
            ))
          ) : (
            <p className={styles.emptyText}>
              더 등록된 도록이 없습니다.
              <br />
              도록 QR코드로 연결
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
