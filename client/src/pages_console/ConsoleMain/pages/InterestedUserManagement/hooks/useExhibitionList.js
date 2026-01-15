import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';

export default function useExhibitionList() {
  const [exhibitionList, setExhibitionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExhibitionList = async (search = '') => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);

      // 새 API 호출 - 좋아요/예약/관람완료 모두 포함
      const response = await userInstance.get(
        `/api/users/console/exhibitions/summary?${params.toString()}`
      );

      const data = Array.isArray(response.data) ? response.data : [];
      setExhibitionList(data);
    } catch (err) {
      setError(err.message);
      console.error('전시회 목록 로드 실패:', err);
      setExhibitionList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExhibitionList();
  }, []);

  return {
    exhibitionList,
    isLoading,
    error,
    loadExhibitionList,
  };
}