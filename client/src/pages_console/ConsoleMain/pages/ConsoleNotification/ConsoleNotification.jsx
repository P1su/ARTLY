import { useEffect, useState, useCallback } from "react";
import { userInstance } from '../../../../apis/instance';
import styles from "./ConsoleNotification.module.css";
import { IoMegaphoneOutline } from "react-icons/io5";

const parseTimestamp = (timestamp) => {
  if (!timestamp) return new Date();
  return new Date(timestamp.replace(" ", "T") + "+09:00");
};

const formatTimestamp = (timestamp) => {
  const date = parseTimestamp(timestamp);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString("ko-KR");
};

const Icon = () => (
  <IoMegaphoneOutline size={22} className={styles.icon} />
);

export default function ConsoleNotification() {
  const [activeTab, setActiveTab] = useState('sent');
  const [notiList, setNotiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotificationHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); 
      
      const token = localStorage.getItem("ACCESS_TOKEN");

      const endpoint = activeTab === 'sent' 
        ? "/api/notification/console" // 전체 발송 내역
        : "/api/notification/user";   // 내 수신 내역

      const res = await userInstance.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data?.data) ? res.data.data : [];

      const mappedData = data.map(item => ({
        id: item.notification_id || item.id,
        title: item.title,
        body: item.body || item.content, 
        create_dtm: item.create_dtm
      }));

      const sorted = mappedData.sort(
        (a, b) =>
          new Date(b.create_dtm).getTime() -
          new Date(a.create_dtm).getTime()
      );

      setNotiList(sorted);
    } catch (err) {
      console.error(err);
      setError("알림 내역을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]); 

  // 🔥 최초 로딩
  useEffect(() => {
    fetchNotificationHistory();
  }, [fetchNotificationHistory]);

  // 🔥 실시간 NEW_NOTIFICATION 감지 → 목록 재조회
  useEffect(() => {
    const handler = () => {
      console.log("🔄 NEW_NOTIFICATION 수신 → 콘솔 알림 목록 재조회");
      fetchNotificationHistory();
    };

    window.addEventListener("NEW_NOTIFICATION", handler);
    return () => window.removeEventListener("NEW_NOTIFICATION", handler);
  }, [fetchNotificationHistory]);

  // =====================================
  // 렌더링
  // =====================================

  if (isLoading) {
    return <div className={styles.layout}>불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.layout}>{error}</div>;
  }

  if (notiList.length === 0) {
    return (
      <div className={styles.layout}>
        <h2>알림 발송 내역이 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'sent' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          보낸 알림
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'received' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('received')}
        >
          받은 알림
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>불러오는 중...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : notiList.length === 0 ? (
        <div className={styles.empty}>내역이 없습니다.</div>
      ) : (
        <div className={styles.list}>
          {notiList.map((item, index) => (
            <div key={`${item.id}-${index}`} className={styles.notificationItem}>
              <div className={styles.iconArea}>
                <Icon />
              </div>

            <div className={styles.contentArea}>
              <div className={styles.headerRow}>
                <span className={styles.notiTitle}>{item.title}</span>
                <span className={styles.timestamp}>
                  {formatTimestamp(item.create_dtm)}
                </span>
              </div>

              <p className={styles.notiBody}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
