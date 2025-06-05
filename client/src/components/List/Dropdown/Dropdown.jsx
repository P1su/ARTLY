import styles from './Dropdown.module.css';
import { useState } from 'react';

export default function Dropdown({
  dropdownItems,
  isOpen,
  filterKey,
  onOpen,
  onSetFilter,
  shape = 'round',
}) {
  const [label, setLabel] = useState(dropdownItems[0].label);

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
        {label}
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
