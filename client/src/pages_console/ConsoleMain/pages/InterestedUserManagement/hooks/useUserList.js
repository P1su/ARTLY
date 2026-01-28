import { useState, useCallback } from 'react';

export default function useUserList() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 갤러리 좋아요 유저 목록 설정 (이미 로드된 데이터 사용)
  const setGalleryUsers = useCallback((users) => {
    setIsLoading(true);
    try {
      const formattedUsers = users.map((item) => ({
        id: item.id,
        userId: item.userId,
        name: item.userName || item.name || '사용자 정보 없음',
        date: item.date
          ? new Date(item.date).toLocaleDateString('ko-KR')
          : '-',
        status: 'like',
      }));

      // 최신순 정렬
      formattedUsers.sort((a, b) => new Date(b.date) - new Date(a.date));

      setUserList(formattedUsers);
      setError(null);
    } catch (err) {
      console.error('유저 목록 설정 실패:', err);
      setError(err.message);
      setUserList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 전시회 유저 목록 설정 (이미 로드된 데이터 사용)
  const setExhibitionUsers = useCallback((users, type = 'like') => {
    setIsLoading(true);
    try {
      const formattedUsers = users.map((item) => ({
        id: item.id,
        userId: item.userId,
        name: item.userName || item.name || '사용자 정보 없음',
        date: item.date
          ? new Date(item.date).toLocaleDateString('ko-KR')
          : '-',
        status: item.status || type,
      }));

      formattedUsers.sort((a, b) => new Date(b.date) - new Date(a.date));

      setUserList(formattedUsers);
      setError(null);
    } catch (err) {
      console.error('유저 목록 설정 실패:', err);
      setError(err.message);
      setUserList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 목록 초기화
  const clearUserList = useCallback(() => {
    setUserList([]);
    setError(null);
  }, []);

  return {
    userList,
    isLoading,
    error,
    setGalleryUsers,
    setExhibitionUsers,
    clearUserList,
  };
}