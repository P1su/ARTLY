import styles from './Dropdown.module.css';
import { useState } from 'react';
import useResponsive from './../../../../hooks/useResponsive';

export default function Dropdown({
  title,
  dropdownItems,
  isOpen,
  filterKey,
  onOpen,
  onSetFilter,
  shape = 'round',
  defaultValue,
}) {
  const initialItem =
    dropdownItems.find((item) => item.value === defaultValue) ||
    dropdownItems[0];

  const [label, setLabel] = useState(initialItem.label);

  const { isMobile } = useResponsive();
  const handleCategory = (category) => {
    setLabel(category.label);

    onSetFilter((prev) => ({
      ...prev,
      [filterKey]: category.value,
    }));
    onOpen();
  };

  return (
    <div className={styles.layout}>
      <button
        className={`${styles.dropdownButton} ${isOpen && styles.clickedButton} ${shape === 'rect' ? styles.rectButton : ''}`}
        onClick={onOpen}
      >
        {!isMobile && `${title} - `}
        <span
          className={`${label !== dropdownItems[0].label && styles.clickedLabel}`}
        >
          {label}
        </span>
      </button>
      <ul
        className={`${isOpen && styles.clickedDropdownList} ${isOpen && styles.undisplay}`}
      >
        {isOpen &&
          dropdownItems.map((item) => (
            <li
              className={`${styles.dropdownItem} ${item.label === label && styles.clickedItem}`}
              key={item.label}
              onClick={() => {
                handleCategory(item);
              }}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}
