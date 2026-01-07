import { useState, useEffect, useCallback } from 'react';
import { userInstance } from '../../../apis/instance';
import { useUser } from '../../../store/UserProvider';
import { useAlert } from '../../../store/AlertProvider';

export default function useDeleteItem() {
  const { showAlert } = useAlert();

  const { user } = useUser();
  const [galleryList, setGalleryList] = useState([]);
  const [exhibitionList, setExhibitionList] = useState([]);

  const [artworkList, setArtworkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  // 갤러리 목록 로드
  const loadGalleries = useCallback(
    async (search = '') => {
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
        // is_console을 true로 설정하여 현재 사용자의 갤러리만 가져옴
        params.append('is_console', true);
        const url = `/api/galleries${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await userInstance.get(url); 

        // API 응답 데이터를 mock 데이터 형식에 맞게 변환
        const galleries = Array.isArray(response.data)
          ? response.data.map((item) => ({
            id: item.id,
            name: item.gallery_name,
            address: item.gallery_address,
            closedDay: item.gallery_closed_day,
            time: `${item.gallery_start_time} - ${item.gallery_end_time}`,
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
    },
    [], // 의존성 제거 - 검색 결과가 덮어쓰기 되는 것 방지
  );

  // 전시회 목록 로드
  const loadExhibitions = useCallback(
    async (galleryName = '') => {
      try {
        setIsLoading(true);
        // 실제 API 호출
        const params = new URLSearchParams();
        if (galleryName && galleryName !== '갤러리 전체') {
          params.append('gallery_name', galleryName);
        }
        const url = `/api/exhibitions${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await userInstance.get(url);

        // API 응답 데이터를 mock 데이터 형식에 맞게 변환
        // 사용자의 갤러리에 속한 전시회만 필터링
        const userGalleryIds = galleryList.map((g) => g.id);
        const exhibitions = Array.isArray(response.data)
          ? response.data
            .filter((item) => {
              // gallery_id가 사용자의 갤러리 목록에 있는지 확인
              return userGalleryIds.includes(item.gallery_id);
            })
            .map((item) => ({
              id: item.id,
              title: item.exhibition_title,
              period: `${item.exhibition_start_date} - ${item.exhibition_end_date}`,
              image: item.exhibition_poster || null,
              gallery_name:
                item.exhibition_organization?.name || '갤러리 정보 없음',
              gallery_id: item.gallery_id || null,
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
    },
    [galleryList],
  );

  // 작품 목록 로드
  // useDeleteItem.js 내부

  const loadArtworks = useCallback(
    async (exhibitionTitle = '') => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (exhibitionTitle && exhibitionTitle !== '전시회 전체') {
          params.append('exhibition_title', exhibitionTitle);
        }
        
        const url = `/api/arts${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await userInstance.get(url);
  
        // 내 전시회 ID 목록
        const myExhibitionIds = exhibitionList.map(e => e.id);
  
        const artworks = Array.isArray(response.data)
          ? response.data
            .filter((item) => {
              // 작품이 내 전시회에 포함되어 있는지 확인
              if (!item.exhibitions || item.exhibitions.length === 0) return false;

              const artExhibitionIds = item.exhibitions.map(ex => ex.id);

              return item.exhibitions.some(ex => 
                myExhibitionIds.includes(Number(ex.id))
              );
            })
            .map((item) => {
              const firstExhibition =
                item.exhibitions && item.exhibitions.length > 0
                  ? item.exhibitions[0]
                  : null;
  
              return {
                id: item.id,
                title: item.art_title || item.title,
                artist:
                  item.artist?.artist_name ||
                  item.artist_name ||
                  '작가 정보 없음',
                image: item.art_image || item.image_url || item.image,
                gallery_name: firstExhibition?.gallery?.gallery_name || '',
                exhibition_title: firstExhibition?.exhibition_title || '',
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
    },
    [exhibitionList],  // galleryList → exhibitionList로 변경
  );

  // 사용자 정보가 있을 때 갤러리 목록 로드 (최초 1회만)
  useEffect(() => {
    if (user?.id) {
      loadGalleries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // loadGalleries 의존성 제거

  // 갤러리 목록이 로드되면 전시회 목록도 로드 (관심유저관리 등에서 필요)
  useEffect(() => {
    if (galleryList.length > 0) {
      loadExhibitions('갤러리 전체');
    }
    // eslint-disable-next-line react-hooks-deps
  }, [galleryList.length]);

  // 전시회 목록이 로드되면 작품 목록도 로드 (관심유저관리 등에서 필요)
  useEffect(() => {
    if (exhibitionList.length > 0 && galleryList.length > 0) {  // galleryList 조건 추가
      loadArtworks('전시회 전체');
    }
  }, [exhibitionList.length, galleryList.length])

  const handleDelete = async (id, type) => {
    try {
      // 1. 낙관적 업데이트 (일단 화면에서 지움)
      if (type === 'gallery') {
        setGalleryList((prev) => prev.filter((item) => item.id !== id));
        await userInstance.delete(`/api/galleries/${id}`);
      } else if (type === 'exhibition') {
        setExhibitionList((prev) => prev.filter((item) => item.id !== id));
        await userInstance.delete(`/api/exhibitions/${id}`);
      } else if (type === 'artwork') {
        setArtworkList((prev) => prev.filter((item) => item.id !== id));
      }

      // 2. API 호출
      let response;
      if (type === 'gallery') {
        response = await userInstance.delete(`/api/galleries/${id}`);
      } else if (type === 'exhibition') {
        response = await userInstance.delete(`/api/exhibitions/${id}`);
      } else if (type === 'artwork') {
        response = await userInstance.delete(`/api/arts/${id}`);
      }

      if (
        typeof response.data === 'string' &&
        (response.data.includes('Fatal error') ||
          response.data.includes('Integrity constraint violation'))
      ) {
        throw new Error('FOREIGN_KEY_ERROR');
      }

      showAlert(
        `${type === 'gallery' ? '갤러리' : type === 'exhibition' ? '전시회' : '작품'} 삭제를 완료하였습니다.`,
      );
    } catch (err) {
      console.error('삭제 실패:', err);

      // 5. 에러 종류에 따른 빨간 모달 띄우기
      if (err.message === 'FOREIGN_KEY_ERROR') {
        showAlert(
          `${type === 'gallery' ? '갤러리를' : type === 'exhibition' ? '전시회를' : '작품을 '} 삭제할 수 없습니다.\n해당 ${type === 'gallery' ? '갤러리' : '전시회'}에 등록된 하위 데이터(${type === 'gallery' ? '전시' : '작가, 작품'} 등)를 먼저 삭제해주세요.`,
          'error', // 빨간색 타입 전달
        );
      } else {
        // 그 외 일반 에러
        showAlert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
      }

      // 6. 삭제 실패했으니 화면 복구 (데이터 다시 로드)
      if (type === 'gallery') {
        loadGalleries();
      } else if (type === 'exhibition') {
        loadExhibitions('갤러리 전체'); // 혹은 현재 선택된 갤러리값 전달
      } else if (type === 'artwork') {
        loadArtworks(''); // 전체 로드
      }
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
