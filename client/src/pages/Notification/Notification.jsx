import React, { useState, useEffect, useCallback } from 'react';
import { userInstance } from '../../apis/instance';
import { useUser } from '../../store/UserProvider.jsx';
import { onForegroundMessage } from '../../apis/FcmService';
import styles from './Notification.module.css';
import { IoMegaphoneOutline } from 'react-icons/io5';

const getIcon = () => {
  const size = 20;
  return <IoMegaphoneOutline size={size} className={styles.iconNotice} />;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR');
};

export default function Notification() {
  const { user, isLoading: isUserLoading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (userId) => {
    if (!userId) {
      setError('사용자 정보가 없어 알림을 불러올 수 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await userInstance.get(`/api/notification/user`);
      const rawData = response.data.data;

      if (!Array.isArray(rawData)) {
        setNotifications([]);
        return;
      }

      const mappedData = rawData
        .map((item) => ({
          id: item.notification_id,
          title: item.title,
          content: item.body,
          timestamp: item.create_dtm,
          read: item.is_checked === '1',
        }))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

      setNotifications(mappedData);
    } catch (err) {
      setError(`알림 목록을 불러오는 데 실패했습니다. (${err.message})`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoading && user?.id) {
      fetchNotifications(user.id);
    } else if (!isUserLoading && !user) {
      setIsLoading(false);
    }
  }, [isUserLoading, user?.id, fetchNotifications]);

  // ✅ 백그라운드 + 포그라운드 메시지 리스너 설정 (iOS 카톡 인앱 대응)
  useEffect(() => {
    if (!user?.id) return;

    // 포그라운드 메시지 처리 (탭이 활성화되어 있을 때)
    const unsubscribeForeground = onForegroundMessage(() => {
      console.log('📌 포그라운드 알림 감지 → 목록 갱신');
      fetchNotifications(user.id);
    });

    // 백그라운드 메시지 처리 (Service Worker에서 전달받음)
    const handleServiceWorkerMessage = (event) => {
      if (event.data?.type === 'NEW_NOTIFICATION') {
        console.log('📌 백그라운드 알림 감지 → 목록 갱신', event.data);
        fetchNotifications(user.id);
      }
    };

    // ✅ iOS 카톡 인앱에서는 navigator.serviceWorker가 undefined일 수 있음
    const sw = navigator?.serviceWorker;

    if (sw && typeof sw.addEventListener === 'function') {
      // 중복 등록 방지
      let attached = false;

      const attach = () => {
        if (attached) return;
        sw.addEventListener('message', handleServiceWorkerMessage);
        attached = true;
      };

      // 현재 활성화된 SW가 있으면 바로 등록
      if (sw.controller) {
        attach();
      }

      // SW가 나중에 활성화될 수도 있으므로 ready 상태도 확인
      if (sw.ready && typeof sw.ready.then === 'function') {
        sw.ready.then(attach).catch(() => {
          // iOS 인앱에서 ready가 실패할 수도 있으니 무시
        });
      }
    }

    return () => {
      unsubscribeForeground?.();

      // removeEventListener도 sw 존재할 때만
      if (sw && typeof sw.removeEventListener === 'function') {
        sw.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, [user?.id, fetchNotifications]);

  if (isLoading) {
    return <div className={styles.layout}>알림을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <div className={styles.errorText}>{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={styles.layout}>
        <h1>알림이 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className={styles.notificationList}>
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`${styles.notificationItem} ${item.read ? styles.readItem : ''}`}
            onClick={() => {
              if (!item.read) handleNotificationClick(item.id);
            }}
          >
            <div className={styles.iconContainer}>{getIcon()}</div>
            <div className={styles.contentArea}>
              <div className={styles.header}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.timestamp}>
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
              <p className={styles.content}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
