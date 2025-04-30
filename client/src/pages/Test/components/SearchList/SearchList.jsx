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
            key={category[0].label}
            filterCategories={category}
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

function FilterTab({ filterCategories, setResult }) {
  const [categoryItem, setCategoryItem] = useState(filterCategories[0].label);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategory = (category) => {
    setCategoryItem(category.label);

    //api 연결
    setResult(category.label);
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
      <span className={styles.filterLabelSpan}>{categoryItem}</span>
      <ul className={styles.dropdownList}>
        {isOpen &&
          filterCategories.map((item) => (
            <li
              key={item.value}
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
