import { useState } from 'react';
import NoticeCategoryTabs from './NoticeCategoryTabs/NoticeCategoryTabs';
import NoticeListTable from './NoticeListTable/NoticeListTable';
import Pagination from './Pagination/Pagination';

export default function NoticeSection() {
  const [activeTab, setActiveTab] = useState('공모');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); 
  };

  return (
    <>
      <NoticeCategoryTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <NoticeListTable activeTab={activeTab} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        activeTab={activeTab}
      />
    </>
  );
}
