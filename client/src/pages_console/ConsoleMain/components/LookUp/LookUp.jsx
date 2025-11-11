import React from 'react';
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

  // 현재 선택된 값을 표시할 텍스트 찾기
  const displayValue = options.find(option => option.value === value)?.name || value || placeholder;

  if (isInput) {
    return (
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
                className={`${styles.dropdownItem} ${
                  value === option.value ? styles.dropdownItemActive : ''
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
