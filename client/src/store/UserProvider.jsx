import { createContext, useEffect, useState, useContext } from 'react'; 
import { userInstance } from './../apis/instance';
import Cookies from 'js-cookie'; 

export const UserContext = createContext();

const JWT_Token = 'ACCESS_TOKEN';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 💡 로딩 상태는 기본 true
  

  useEffect(() => {
    const authenticateUser = async () => {
      const storedToken = Cookies.get(JWT_Token);
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await userInstance.get('/api/users/me'); 
          
          setUser(res.data); 
        } catch (error) {
          Cookies.remove(JWT_Token, { path: '/' }); 
          setToken(null);
          setUser(null);
        }
      } 
      setIsLoading(false); 
    };
    authenticateUser(); 
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    Cookies.set(JWT_Token, jwt, { 
        expires: 1, 
        path: '/', 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict' 
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove(JWT_Token, { path: '/' }); 
  };
  const value = { user, setUser, token, login, logout, isLoading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
    return useContext(UserContext); 
};