import React, { useState } from 'react';

interface HeaderProps {
  isLoggedIn: boolean;
  nickname?: string;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, nickname, onLogin, onLogout }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#5a4fcf',
      color: 'white',
      position: 'relative'
    }}>
      {/* 왼쪽 로고 */}
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
        Artly
      </div>

      {/* 오른쪽 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
        {isLoggedIn ? (
          <>
            {/* 닉네임 + 드롭다운 */}
            <div
              onClick={toggleMenu}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span>{nickname} 님</span>
              <span>▼</span>
            </div>

            {/* 마이페이지 버튼 */}
            <button style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              마이페이지
            </button>

            {/* 닉네임 클릭시 드롭다운 */}
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '80px',
                background: 'white',
                color: 'black',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '10px',
                zIndex: 100,
                width: '100px',
                textAlign: 'center'
              }}>
                <div
                  onClick={onLogout}
                  style={{
                    cursor: 'pointer',
                    color: 'red',
                    fontWeight: 'bold',
                  }}
                >
                  로그아웃
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 로그인 전 */}
            <button
              onClick={onLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              로그인
            </button>

            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
