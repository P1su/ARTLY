import { useState, useEffect, useRef } from 'react';

/**
 * 디바운스가 적용된 검색 hook
 * @param {Function} onSearch - 검색 실행 함수 (query를 파라미터로 받음)
 * @param {Function} onEmptySearch - 빈 문자열일 때 실행할 함수 (선택적)
 * @param {Function} onSearchValueChange - 검색어 변경 시 부모에 전달할 함수 (선택적)
 * @param {Function} onClearSearch - 검색어 초기화 시 추가로 실행할 함수 (선택적)
 * @param {number} minLength - 최소 검색 글자 수 (기본값: 2)
 * @param {number} delay - 디바운스 지연 시간 ms (기본값: 500)
 * @returns {Object} { searchValue, handleSearchChange, clearSearch }
 */
export default function useDebounceSearch({
  onSearch,
  onEmptySearch,
  onSearchValueChange,
  onClearSearch,
  minLength = 2,
  delay = 500
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

  // 검색어 초기화 함수
  const clearSearch = () => {
    handleSearchChange('');
    
    // 추가 로직이 있으면 실행
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
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
    clearSearch
  };
}

