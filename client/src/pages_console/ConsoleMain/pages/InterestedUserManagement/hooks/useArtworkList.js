import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';

export default function useArtworkList() {
  const [artworkList, setArtworkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadArtworkList = async (search = '') => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('liked_type', 'art');
      if (search) params.append('search', search);

      const response = await userInstance.get(
        `/api/users/console/likes?${params.toString()}`
      );

      const data = Array.isArray(response.data) ? response.data : [];

      // 작품별로 그룹화
      const artworkMap = new Map();

      data.forEach((item) => {
        const artId = item.art?.id;
        if (!artId) return;

        if (!artworkMap.has(artId)) {
          artworkMap.set(artId, {
            id: artId,
            title: item.art?.art_title || '작품 정보 없음',
            artImage: item.art?.art_image || null,
            artistName: item.art?.artist_name || '-',
            likeCount: 0,
            lastActivity: null,
            users: [],
          });
        }

        const artwork = artworkMap.get(artId);
        artwork.likeCount++;
        artwork.users.push({
          id: item.id,
          userId: item.user?.id,
          userName: item.user?.user_name || '사용자 정보 없음',
          date: item.create_dtm,
        });

        if (!artwork.lastActivity || new Date(item.create_dtm) > new Date(artwork.lastActivity)) {
          artwork.lastActivity = item.create_dtm;
        }
      });

      // 배열로 변환 후 최신순 정렬, 날짜 포맷팅
      const artworks = Array.from(artworkMap.values())
        .map((a) => ({
          ...a,
          lastActivity: a.lastActivity
            ? new Date(a.lastActivity).toLocaleDateString('ko-KR')
            : '-',
        }))
        .sort((a, b) => {
          const dateA = new Date(a.lastActivity || 0);
          const dateB = new Date(b.lastActivity || 0);
          return dateB - dateA;
        });

      setArtworkList(artworks);
    } catch (err) {
      setError(err.message);
      console.error('작품 목록 로드 실패:', err);
      setArtworkList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArtworkList();
  }, []);

  return {
    artworkList,
    isLoading,
    error,
    loadArtworkList,
  };
}