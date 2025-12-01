import { useState, useEffect, useRef, useCallback } from 'react';

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

  // useCallback으로 감싸서 렌더링 최적화
  const handleSearchChange = useCallback(
    (query) => {
      setSearchValue(query);

      if (onSearchValueChange) {
        onSearchValueChange(query);
      }

      // 이전 타이머 취소
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // 1. 입력값이 없을 때
      if (!query.trim()) {
        if (onEmptySearch) {
          onEmptySearch();
        }
        return;
      }

      // 2. 최소 글자 수 미만일 때 (검색 안 함)
      if (query.trim().length < minLength) {
        return;
      }

      // 3. 디바운스 검색 실행
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(query);
      }, delay);
    },
    [onSearch, onEmptySearch, onSearchValueChange, minLength, delay],
  ); // 의존성 배열 추가

  const clearSearch = useCallback(() => {
    handleSearchChange('');
    if (onClearSearch) {
      onClearSearch();
    }
  }, [handleSearchChange, onClearSearch]);

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
