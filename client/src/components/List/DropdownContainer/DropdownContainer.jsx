import styles from './DropdownContainer.module.css';
import { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';

export default function DropdownContainer({
  filterList,
  onSetFilter,
  shape = 'round',
}) {
  const [itemIndex, setItemIndex] = useState(null);
  const handleOpen = (num) => {
    setItemIndex(itemIndex === num ? null : num);
  };

  return (
    <div className={styles.layout}>
      {filterList.map((item, idx) => (
        <Dropdown
          key={item.key}
          dropdownItems={item.options}
          filterKey={item.key}
          isOpen={idx === itemIndex}
          onOpen={() => {
            handleOpen(idx);
          }}
          onSetFilter={onSetFilter}
          shape={shape}
        />
      ))}
    </div>
  );
}
