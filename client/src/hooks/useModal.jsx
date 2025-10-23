import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    handleOpenModal,
  };
};

export default useModal;
