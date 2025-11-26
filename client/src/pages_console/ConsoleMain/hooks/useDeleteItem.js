import { useState, useEffect, useCallback } from 'react';
import { userInstance } from '../../../apis/instance';
import { useNavigate } from 'react-router-dom';

export default function useDeleteItem() {
  const [galleryList, setGalleryList] = useState([]);
  const [exhibitionList, setExhibitionList] = useState([]);

  const [artworkList, setArtworkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 갤러리 목록 로드
  const loadGalleries = useCallback(async (search = '') => {
    try {
      setIsLoading(true);
      // 검색어가 있으면 검색 중 상태로 표시
      if (search.trim()) {
        setIsSearching(true);
      }

      // 실제 API 호출 (방법 1 + /api/galleries 경로)
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      const url = `/api/galleries${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await userInstance.get(url);

      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const galleries = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
            name: item.gallery_name || '정보 없음',
            address: item.gallery_address || '정보 없음',
            closedDay: item.gallery_closed_day || '정보 없음',
            time: `${item.gallery_start_time || '정보 없음'} - ${item.gallery_end_time || '정보 없음'}`,
            registered: item.exhibitions ? item.exhibitions.length : 0,
            liked: item.like_count,
            image: item.gallery_image,
          }))
        : [];

      setGalleryList(galleries);
    } catch (err) {
      setError(err.message);
      console.error('갤러리 목록 로드 실패:', err);
      console.error('에러 상세:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      console.error('에러 헤더:', err.response?.headers);
      setGalleryList([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  // 전시회 목록 로드
  const loadExhibitions = useCallback(async (galleryId = '') => {
    try {
      setIsLoading(true);
      // 실제 API 호출
      const params = new URLSearchParams();
      if (galleryId && galleryId !== '갤러리 전체') {
        params.append('gallery_id', galleryId);
      }
      const url = `/api/exhibitions${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await userInstance.get(url);

      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const exhibitions = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
            title: item.exhibition_title,
            period: `${item.exhibition_start_date} - ${item.exhibition_end_date}`,
            image: item.exhibition_poster || null, // API에 없을 경우 null
            gallery_name:
              item.exhibition_organization?.name || '갤러리 정보 없음',
            gallery_id: item.gallery_id || null, // 갤러리 ID 추가 (최상위 레벨)
            value: item.exhibition_organization?.name || '갤러리 정보 없음',
          }))
        : [];

      setExhibitionList(exhibitions);
    } catch (err) {
      setError(err.message);
      console.error('전시회 목록 로드 실패:', err);
      setExhibitionList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 작품 목록 로드
  const loadArtworks = useCallback(async (galleryId = '') => {
    try {
      setIsLoading(true);
      // 실제 API 호출
      const params = new URLSearchParams();
      if (galleryId && galleryId !== '갤러리 전체') {
        params.append('gallery_id', galleryId);
      }
      const url = `/api/arts${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await userInstance.get(url);

      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const artworks = Array.isArray(response.data)
        ? response.data.map((item) => {
            // exhibitions 배열에서 첫 번째 전시회의 갤러리 정보 추출
            const firstExhibition =
              item.exhibitions && item.exhibitions.length > 0
                ? item.exhibitions[0]
                : null;
            const galleryName =
              firstExhibition?.gallery?.gallery_name || '갤러리 정보 없음';
            const galleryId =
              firstExhibition?.gallery_id ||
              firstExhibition?.gallery?.id ||
              null;

            return {
              id: item.id,
              title: item.art_title,
              artist: item.artist?.artist_name || '작가 정보 없음',
              image: item.art_image || null,
              gallery_name: galleryName,
              gallery_id: galleryId,
              value: galleryName,
            };
          })
        : [];

      setArtworkList(artworks);
    } catch (err) {
      setError(err.message);
      console.error('작품 목록 로드 실패:', err);
      setArtworkList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 갤러리 목록 로드
  useEffect(() => {
    loadGalleries();
  }, []);

  const handleDelete = async (id, type) => {
    try {
      if (type === 'gallery') {
        await userInstance.delete(`/api/galleries/${id}`);
        setGalleryList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'exhibition') {
        await userInstance.delete(`/api/exhibitions/${id}`);
        setExhibitionList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'artwork') {
        await userInstance.delete(`/api/arts/${id}`);
        setArtworkList((prev) => prev.filter((item) => item.id !== id));
      }
      alert(
        `${type === 'gallery' ? '갤러리' : type === 'exhibition' ? '전시회' : '작품'} 삭제를 완료하였습니다.`,
      );

      let targetTab = '갤러리관리';
      if (type === 'exhibition') targetTab = '전시회관리';
      else if (type === 'artwork') targetTab = '작품관리';

      navigate('/console/main', {
        state: { activeTab: targetTab },
        replace: true,
      });
    } catch (err) {
      setError(err.message);
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    galleryList,
    exhibitionList,
    artworkList,
    handleDelete,
    loadGalleries,
    loadExhibitions,
    loadArtworks,
    isLoading,
    isSearching,
    error,
  };
}
