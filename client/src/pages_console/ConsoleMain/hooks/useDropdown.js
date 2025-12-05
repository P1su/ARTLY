import { useState, useRef, useEffect } from 'react';

export default function useDropdown(initialValue = '', placeholder = '') {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue || placeholder);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option, onChange) => {
    setSelectedValue(option.name);
    onChange(option.id);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const openDropdown = () => {
    setIsOpen(true);
  };

  return {
    isOpen,
    selectedValue,
    dropdownRef,
    handleOptionClick,
    toggleDropdown,
    closeDropdown,
    openDropdown,
    setSelectedValue
  };
}


