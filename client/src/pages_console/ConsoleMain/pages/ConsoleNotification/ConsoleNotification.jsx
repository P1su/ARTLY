import { useEffect, useState } from "react";
import { userInstance } from '../../../../apis/instance';
import styles from "./ConsoleNotification.module.css";

export default function ConsoleNotification() {
  const [notiList, setNotiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 알림 발송 내역 조회
  const fetchNotificationHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("ACCESS_TOKEN");

      const res = await userInstance.get("/api/notification/console", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("알림 발송 내역 응답:", res.data);

      // ⭐ 핵심 포인트: 반드시 res.data.data 를 넣어야 렌더링됨!
      setNotiList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setError("알림 내역을 불러오는 데 실패했습니다.");
      setNotiList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationHistory();
  }, []);

  // =====================================
  // 렌더링
  // =====================================

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>알림 발송 내역</h2>

      {/* 데이터 없음 */}
      {notiList.length === 0 && (
        <p className={styles.empty}>발송된 알림 내역이 없습니다.</p>
      )}

      {/* 데이터 목록 */}
      {notiList.length > 0 && (
        <ul className={styles.list}>
          {notiList.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.row}>
                <span className={styles.label}>제목</span>
                <span className={styles.value}>{item.title}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>내용</span>
                <span className={styles.value}>{item.body}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>발송일</span>
                <span className={styles.value}>{item.create_dtm}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}