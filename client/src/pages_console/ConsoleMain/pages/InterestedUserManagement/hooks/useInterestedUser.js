import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';
import useDebounceSearch from '../../../hooks/useDebounceSearch';

export default function useInterestedUser() {
  const [interestedUserList, setInterestedUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery');

  // 관심유저 목록 로드
  const loadInterestedUsers = async (likedType = 'gallery', search = '') => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('liked_type', likedType);
      if (search) {
        params.append('search', search);
      }
      // userInstance가 interceptor를 통해 자동으로 Authorization 헤더 추가
      const response = await userInstance.get(
        `/api/users/console/likes?${params.toString()}`
      );

      const data = Array.isArray(response.data) ? response.data : [];

      const users = data.map((item) => ({
        id: item.id,
        userId: item.user_id || item.user?.id,
        name: item.user?.user_name || '사용자 정보 없음',
        category:
          item.gallery?.gallery_name ||
          item.exhibition?.exhibition_title ||
          item.art?.art_title ||
          '정보 없음',
        date: item.create_dtm
          ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
          : '날짜 정보 없음',
        userName: item.user?.user_name || '사용자 정보 없음',
        galleryName: item.gallery?.gallery_name || '갤러리 정보 없음',
        exhibitionName: item.exhibition?.exhibition_title || '전시회 정보 없음',
        artworkName: item.art?.art_title || '작품 정보 없음',
        type: likedType,
      }));

      setInterestedUserList(users);
    } catch (err) {
      setError(err.message);
      console.error('관심유저 목록 로드 실패:', err);
      console.error('에러 상세:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      setInterestedUserList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 서버에서 받은 데이터를 최신순으로 정렬
  const sortedUserList = [...interestedUserList].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA;
  });

  // 탭 변경 핸들러
  const handleTabChange = async (tab, currentSearchQuery = '') => {
    setActiveTab(tab);

    if (currentSearchQuery && currentSearchQuery.length >= 2) {
      await loadInterestedUsers(tab, currentSearchQuery);
    } else {
      await loadInterestedUsers(tab);
    }
  };  

  // 실제 검색 실행 함수
  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      await loadInterestedUsers(activeTab, query);
    } finally {
      setIsSearching(false);
    }
  };
  

    
  // 디바운스 검색 hook 사용
  const {
    searchValue: searchQuery,
    handleSearchChange,
    clearSearch,
  } = useDebounceSearch({
    onSearch: performSearch,
    onEmptySearch: () => loadInterestedUsers(activeTab),
    onClearSearch: () => loadInterestedUsers(activeTab, ''),
    minLength: 2,
    delay: 500,
  });

  // 컴포넌트 마운트 시 관심유저 로드
  useEffect(() => {
    handleTabChange('gallery');
  }, []);

  return {
    interestedUserList: sortedUserList,
    setInterestedUserList,
    searchQuery,
    isLoading,
    isSearching,
    error,
    activeTab,
    loadInterestedUsers,
    handleSearchChange,
    clearSearch,
    handleTabChange,
  };
}
