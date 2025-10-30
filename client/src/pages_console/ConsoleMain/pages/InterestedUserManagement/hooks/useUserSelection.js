import { useState } from 'react';

export default function useUserSelection() {
  const [selectedUserList, setSelectedUserList] = useState([]);

  const handleUserSelect = (id) => {
    setSelectedUserList(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (userList) => {
    const isAllSelected = userList.length > 0 && userList.every(user => selectedUserList.includes(user.id));
    
    if (isAllSelected) {
      // 전체 해제: 현재 필터링된 모든 사용자 해제
      const newSelection = selectedUserList.filter(userId => 
        !userList.some(user => user.id === userId)
      );
      setSelectedUserList(newSelection);
    } else {
      // 전체 선택: 현재 필터링된 모든 사용자 선택
      const usersToAdd = userList.filter(user => !selectedUserList.includes(user.id));
      const newUserIds = usersToAdd.map(user => user.id);
      setSelectedUserList(prev => [...prev, ...newUserIds]);
    }
  };

  const clearSelection = () => {
    setSelectedUserList([]);
  };

  const isAllSelected = (userList) => {
    return userList.length > 0 && userList.every(user => selectedUserList.includes(user.id));
  };

  return {
    selectedUserList,
    handleUserSelect,
    handleSelectAll,
    clearSelection,
    isAllSelected
  };
}


