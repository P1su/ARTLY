import styles from './FilterTab.module.css';
import { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';

export default function FilterTab({ filterList }) {
  const [displayNum, setDisplayNum] = useState(-1);

  return (
    <div className={styles.layout}>
      <ul className={styles.filterList}>
        {filterList.map((item, idx) => (
          <div
            key={item}
            onMouseOver={() => {
              setDisplayNum(idx);
            }}
            onMouseOut={() => {
              setDisplayNum(-1);
            }}
          >
            <li>{item}</li>
            {displayNum === idx && <Dropdown />}
          </div>
        ))}
      </ul>
    </div>
  );
}
