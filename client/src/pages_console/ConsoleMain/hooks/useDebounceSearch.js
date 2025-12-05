import { useState, useEffect, useRef } from 'react';

export default function useDebounceSearch({
  onSearch,
  onEmptySearch,
  onSearchValueChange,
  onClearSearch,
  minLength = 1,
  delay = 500,
}) {
  const [searchValue, setSearchValue] = useState('');
  const searchTimeoutRef = useRef(null);

  // 검색어 변경 핸들러 (디바운스 적용)
  const handleSearchChange = (query) => {
    setSearchValue(query);

    // 부모 컴포넌트에 검색어 변경 알림 (선택적)
    if (onSearchValueChange) {
      onSearchValueChange(query);
    }

    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 입력값 없으면 빈 검색 실행 또는 전체 목록 로드
    if (!query.trim()) {
      if (onEmptySearch) {
        onEmptySearch();
      }
      return;
    }

    // 최소 글자 수 미만이면 검색 안 함
    if (query.trim().length < minLength) {
      return;
    }

    // 디바운스: delay ms 후에 검색 실행
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, delay);
  };

  const clearSearch = () => {
    handleSearchChange('');

    // 추가 로직이 있으면 실행
    if (onClearSearch) {
      onClearSearch();
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    handleSearchChange,
    clearSearch,
  };
}