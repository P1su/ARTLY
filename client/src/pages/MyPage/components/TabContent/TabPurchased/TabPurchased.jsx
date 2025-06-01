import React, { useEffect, useState } from 'react';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';
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
        const res = await instance.get('/api/users/me/purchases');
        const purchases = res.data;

        // 1. 모든 book에서 exhibition_id를 Set으로 모으기
        const exhibitionIds = new Set(purchases.map((p) => p.exhibition_id));
        // 2. exhibition_id로 전시회 정보 가져오는 함수 (Promise 반환)

        const fetchExhibitionInfo = async (exhibitionId) => {
          try {
            const res = await instance.get(`/api/exhibitions/${exhibitionId}`);
            return { [exhibitionId]: res.data }; // exhibitionId를 키로 사용
          } catch {
            return { [exhibitionId]: null };
          }
        };

        // 3. 모든 exhibitionId에 대해 API 호출 후 Promise.all로 기다리기
        const exhibitionPromises =
          Array.from(exhibitionIds).map(fetchExhibitionInfo);
        const exhibitionInfos = await Promise.all(exhibitionPromises);

        // 4. exhibition 정보를 객체로 변환 (exhibitionId를 키로 사용)
        const exhibitionMap = Object.assign({}, ...exhibitionInfos);

        // 5. book 데이터와 exhibition 정보 합치기
        const purchasesWithExhibition = purchases.map((p) => ({
          ...p,
          ...exhibitionMap[p.exhibition_id],
        }));
        console.log(purchasesWithExhibition);

        setPurchased(purchasesWithExhibition);
      } catch (err) {
        console.error(err);
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
                key={item.id} // item에 id가 있다고 가정
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
