'use client'; // Asegura que este componente se ejecute solo en el cliente
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Leer el token de localStorage solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []); // Se ejecuta solo al montar el componente

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}