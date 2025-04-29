import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom'; 
import Header from './components/Header';  
import Navbar from './components/NavBar';

const App = () => {
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
      <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Header 
          isLoggedIn={isLoggedIn}
          nickname={nickname}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        <Navbar />

        <div style={{ marginTop: '40px', padding: '20px' }}>
          <h2>메인 페이지입니다!</h2>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
