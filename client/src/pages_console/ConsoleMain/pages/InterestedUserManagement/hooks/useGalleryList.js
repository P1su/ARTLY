import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';

export default function useGalleryList() {
  const [galleryList, setGalleryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGalleryList = async (search = '') => {
    try {
      setIsLoading(true);
      setError(null);

      // 기존 API 사용
      const params = new URLSearchParams();
      params.append('liked_type', 'gallery');
      if (search) params.append('search', search);

      const response = await userInstance.get(
        `/api/users/console/likes?${params.toString()}`
      );

      const data = Array.isArray(response.data) ? response.data : [];

      // 갤러리별로 그룹화
      const galleryMap = new Map();

      data.forEach((item) => {
        const galleryId = item.gallery?.id;
        if (!galleryId) return;

        if (!galleryMap.has(galleryId)) {
          galleryMap.set(galleryId, {
            id: galleryId,
            name: item.gallery?.gallery_name || '갤러리 정보 없음',
            galleryImage: item.gallery?.gallery_image || null,
            likeCount: 0,
            lastActivity: null,
            users: [],
          });
        }

        const gallery = galleryMap.get(galleryId);
        gallery.likeCount++;
        gallery.users.push({
          id: item.id,
          userId: item.user?.id,
          userName: item.user?.user_name || '사용자 정보 없음',
          date: item.create_dtm,
        });

        // 최근 활동일 업데이트
        if (!gallery.lastActivity || new Date(item.create_dtm) > new Date(gallery.lastActivity)) {
          gallery.lastActivity = item.create_dtm;
        }
      });

      // Map을 배열로 변환 후 최신순 정렬, 날짜 포맷팅
      const galleries = Array.from(galleryMap.values())
        .map((g) => ({
          ...g,
          lastActivity: g.lastActivity
            ? new Date(g.lastActivity).toLocaleDateString('ko-KR')
            : '-',
        }))
        .sort((a, b) => {
          const dateA = new Date(a.lastActivity || 0);
          const dateB = new Date(b.lastActivity || 0);
          return dateB - dateA;
        });

      setGalleryList(galleries);
    } catch (err) {
      setError(err.message);
      console.error('갤러리 목록 로드 실패:', err);
      setGalleryList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryList();
  }, []);

  return {
    galleryList,
    isLoading,
    error,
    loadGalleryList,
  };
}