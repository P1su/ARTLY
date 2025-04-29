import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const menuItems = [
    { label: '전시회', path: '/exhibitions' },
    { label: '갤러리', path: '/galleries' },
    { label: '작가', path: '/artists' },
    { label: '갤러리 찾기', path: '/find-gallery' },
    { label: '공고', path: '/notices' },
  ];

  return (
    <nav style={{ 
      width: '100%',            // ✅ 가로 전체
      height: '60px',           // ✅ 높이 고정
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',     // ✅ 포지션도 설정
      zIndex: 1
    }}>
      <ul style={{ 
        listStyle: 'none', 
        display: 'flex', 
        alignItems: 'center',    // ✅ ul 안 요소들도 수직정렬
        gap: '30px', 
        padding: 0, 
        margin: 0,
        height: '100%'           // ✅ ul이 nav 전체 높이에 맞추기
      }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#5a4fcf' : 'black',
                fontWeight: 'bold',
              })}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
