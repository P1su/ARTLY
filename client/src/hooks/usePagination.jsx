import { useState } from 'react';

const usePagination = (itemsPerPage = 10, data) => {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = data.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    pageItems,
  };
};
export default usePagination;
