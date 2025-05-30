import styles from './DropdownContainer.module.css';
import { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';

export default function DropdownContainer({ filterList }) {
  const [itemIndex, setItemIndex] = useState(null);
  const handleOpen = (num) => {
    setItemIndex(itemIndex === num ? null : num);
  };

  return (
    <div className={styles.layout}>
      {filterList.map((item, idx) => (
        <Dropdown
          key={item}
          dropdownItems={item}
          isOpen={idx === itemIndex}
          onOpen={() => {
            handleOpen(idx);
          }}
        />
      ))}
    </div>
  );
}
