import styles from './Dropdown.module.css';
import { useState } from 'react';

export default function Dropdown({ dropdownItems, isOpen, onOpen }) {
  const [filter, setFilter] = useState(dropdownItems[0].label);

  const handleCategory = (category) => {
    setFilter(category.label);

    //api 연결
    onOpen(null);
  };

  return (
    <div className={styles.layout}>
      <button
        className={`${styles.dropdownButton} ${isOpen && styles.clickedButton}`}
        onClick={onOpen}
      >
        {filter}
      </button>
      <ul className={styles.dropdownList}>
        {isOpen &&
          dropdownItems.map((item) => (
            <li
              className={`${styles.dropdownItem} ${item.label === filter && styles.clickedItem}`}
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
