import { createContext, useEffect, useState } from 'react';
import { userInstance } from './../apis/instance';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // 사용자 정보 저장

  useEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN')) {
      const fetchUserInfo = async () => {
        try {
          const res = await userInstance.get('api/users/me');
          setUser(res.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserInfo();
    }
  }, []);

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

  const value = { user, setUser, token, login, logout };

  console.log(user);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
