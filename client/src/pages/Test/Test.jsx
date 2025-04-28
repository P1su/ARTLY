import styles from './Test.module.css';
import { useState } from 'react';
import { filterList } from './utils/filter.js';

export default function Test() {
  return (
    <div className={styles.layout}>
      <h1>아뜰리</h1>
      테스트페이지입니다.
      <section className={styles.filterSection}>
        {filterList.map((category) => (
          <FilterTab key={category[0]} filterCategory={category} />
        ))}
      </section>
    </div>
  );
}

function FilterTab({ filterCategory }) {
  const [categoryItem, setCategoryItem] = useState(filterCategory[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategory = (category) => {
    setCategoryItem(category);
    setIsOpen(false);
  };

  return (
    <div
      className={styles.filterLayout}
      onMouseOver={() => {
        setIsOpen(true);
      }}
      onMouseOut={() => {
        setIsOpen(false);
      }}
    >
      <div className={styles.filterLabel}>{categoryItem}</div>
      <ul className={styles.dropdownList}>
        {isOpen &&
          filterCategory.map((item) => (
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
