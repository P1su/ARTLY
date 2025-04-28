import styles from './SearchList.module.css';
import { useState } from 'react';
import { filterList } from '../../utils/filter.js';

export default function SearchList() {
  const [result, setResult] = useState('');

  //result 값 렌더링
  console.log(result);

  return (
    <div>
      <section className={styles.filterSection}>
        {filterList.map((category) => (
          <FilterTab
            key={category[0]}
            filterCategory={category}
            setResult={setResult}
          />
        ))}
      </section>
      <section>
        <span>{result}</span>
      </section>
    </div>
  );
}

function FilterTab({ filterCategory, setResult }) {
  const [categoryItem, setCategoryItem] = useState(filterCategory[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategory = (category) => {
    setCategoryItem(category);

    //api 연결
    setResult(category);
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
