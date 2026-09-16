import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initialization so user and token are ready on the very first render cycle
  const [token, setToken] = useState(() => {
    return localStorage.getItem('voltslot_token') || null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('voltslot_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('voltslot_user');
        localStorage.removeItem('voltslot_token');
        return null;
      }
    }
    return null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('voltslot_token', authToken);
    localStorage.setItem('voltslot_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('voltslot_token');
    localStorage.removeItem('voltslot_user');
    localStorage.removeItem('voltslot_current_page');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);