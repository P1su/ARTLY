import React, { useState, useEffect, useRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import useDropdown from '../../hooks/useDropdown';
import styles from './LookUp.module.css';

export default function LookUp({
  value,
  onChange,
  placeholder = "갤러리를 선택하세요",
  isInput = false,
  options = [],
  title = "갤러리 선택"
}) {
  const {
    isOpen,
    selectedValue,
    dropdownRef,
    handleOptionClick,
    toggleDropdown
  } = useDropdown(value, placeholder);

  // 로컬 상태 도입: 입력 중 커서 튐 방지
  const [localValue, setLocalValue] = useState(value || '');

  // input 요소 참조 (필요 시 포커스 관리 등을 위해 유지)
  const inputRef = useRef(null);

  // 부모의 value prop이 변경되면 로컬 상태 동기화
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
    }
  }, [value]);

  // 현재 선택된 값을 표시할 텍스트 찾기
  const displayValue = options.find(option => option.id === value)?.name || placeholder;

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // 로컬 상태 즉시 업데이트
    onChange(newValue); // 부모에게 변경 알림
  };

  if (isInput) {
    return (
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.inputField}
        />
      </div>
    );
  }

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.inputContainer} ref={dropdownRef}>
        <div className={styles.dropdownTrigger} onClick={toggleDropdown}>
          <span className={styles.inputField}>{displayValue}</span>
          <HiChevronDown
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdownList}>
            {options.map((option) => (
              <div
                key={option.id}
                className={`${styles.dropdownItem} ${value === option.id ? styles.dropdownItemActive : ''
                  }`}
                onClick={() => handleOptionClick(option, onChange)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
