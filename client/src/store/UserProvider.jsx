import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProdiver({ children }) {
  const [user, setUser] = useState(null); // 사용자 정보 저장
  const [token, setToken] = useState(null);
  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('ACCESS_TOKEN', jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ACCESS_TOKEN');
  };

  const value = { user, token, login, logout };

  console.log(user);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
