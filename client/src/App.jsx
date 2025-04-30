import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import NavBar from './components/NavBar/NavBar';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setNickname('아뜰리');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNickname('');
  };

  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: '#f9f9f9',
          minHeight: '100vh'
        }}
      >
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Header
            isLoggedIn={isLoggedIn}
            nickname={nickname}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <NavBar />
          <main>
            <h2 style={{ marginTop: '15rem', textAlign: 'center' }}>
              메인 페이지입니다!
            </h2>
          </main>
        </section>
      </div>
    </BrowserRouter>
  );
}
