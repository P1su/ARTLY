import React, { useEffect, useState } from 'react';
import { instance } from '../../../../../apis/instance';
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
        const res = await instance.get('/api/users/me/purchases');
        const purchases = res.data;

        // 백엔드 필드 수정시 삭제 예정
        const exhibitionIds = new Set(purchases.map((p) => p.exhibition_id));

        const fetchExhibitionInfo = async (exhibitionId) => {
          try {
            const res = await instance.get(`/api/exhibitions/${exhibitionId}`);
            return { [exhibitionId]: res.data };
          } catch {
            return { [exhibitionId]: null };
          }
        };

        const exhibitionPromises =
          Array.from(exhibitionIds).map(fetchExhibitionInfo);
        const exhibitionInfos = await Promise.all(exhibitionPromises);

        const exhibitionMap = Object.assign({}, ...exhibitionInfos);

        const purchasesWithExhibition = purchases.map((p) => ({
          ...p,
          ...exhibitionMap[p.exhibition_id],
        }));

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
