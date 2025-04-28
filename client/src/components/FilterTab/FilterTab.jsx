import styles from './FilterTab.module.css';
import { useState } from 'react';

export default function FilterTab({ filterList }) {
  const [categoryItem, setCategoryItem] = useState(filterList[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategory = (category) => {
    setCategoryItem(category);
    setIsOpen(false);
  };

  return (
    <div className={styles.layout}>
      <div
        className={styles.filterLabel}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {categoryItem}
      </div>
      <ul className={styles.dropdownList}>
        {isOpen &&
          filterList.map((item) => (
            <li
              key={item}
              onClick={() => {
                handleCategory(item);
              }}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
}
