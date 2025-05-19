/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "./interfaces/user.interface";
import { IFormLogin } from "@/components/Forms/LoginForm/types";
import { IFormRegister } from "@/components/Forms/RegisterForm/types";
import { fetchLogin } from "@/services/auth-services/fetchLogin";
import { fetchRegister } from "@/services/auth-services/fetchRegister";
import { fetchGetUser } from "@/services/auth-services/fetchGetUser";
import { fetchGoogleLogin } from "@/services/auth-services/fetchGoogleLogin";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null; // Agregado
  loading: boolean;
  errors: string[];
  login: (credentials: IFormLogin) => Promise<void>;
  register: (credentials: IFormRegister) => Promise<void>;
  logout: () => void;
  userValidated: boolean;
  setUserValidated: (isValidated: boolean) => void;
  googleLogin: (credential: string) => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Estado para el token
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [userValidated, setUserValidated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const login = async (credentials: IFormLogin): Promise<void> => {
    setLoading(true);
    setErrors([]);
    try {
      const responseData = await fetchLogin(credentials);
      const accessToken = responseData?.access_token;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setToken(accessToken); // Actualiza el estado del token
        const userData = await fetchGetUser(accessToken);
        setUser(userData);
        setUserValidated(true);
        router.push("/Dashboard");
      } else {
        setErrors(["No se recibió el token de autenticación."]);
      }
    } catch (error: any) {
      console.error("Error en el inicio de sesión:", error);
      setErrors([error.message || "Error en el inicio de sesión"]);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential: string): Promise<void> => {
    setLoading(true);
    setErrors([]);
    try {
      const accessToken = await fetchGoogleLogin(credential);
      localStorage.setItem('token', accessToken);
      setToken(accessToken); // Actualiza el estado del token
      const userData = await fetchGetUser(accessToken);
      setUser(userData);
      setUserValidated(true);
      router.push("/Dashboard");
    } catch (error: any) {
      console.error("Error en la autenticación con Google:", error);
      setErrors([error.message || "Error en la autenticación con Google"]);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: IFormRegister): Promise<void> => {
    setLoading(true);
    setErrors([]);
    try {
      await fetchRegister(credentials);
      router.push("/Login");
    } catch (error: any) {
      console.error("Error en el registro:", error);
      setErrors([error.message || "Error al registrar el usuario."]);
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setLoading(true);
    setErrors([]);
    try {
      localStorage.removeItem("token");
      setToken(null); // Limpia el estado del token
      setUser(null);
      setUserValidated(false);
      router.push("/Login");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      setErrors([error.message || "Error al cerrar sesión."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setUserValidated(true);
        setToken(null); // Asegura que el token sea null si no hay token
        return;
      }
      try {
        const userData = await fetchGetUser(storedToken);
        setUser(userData);
        setToken(storedToken); // Establece el token en el estado
        setUserValidated(true);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          console.warn("Token expirado o inválido. Cerrando sesión...");
        } else {
          console.error("Error al verificar el token:", error.message);
        }
        localStorage.removeItem("token");
        setToken(null); // Limpia el estado del token
        setUser(null);
        setUserValidated(true);
        router.push("/Login");
      }
    };

    verifyToken();
  }, [router]);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      token, // Agregado al contexto
      loading,
      errors,
      login,
      register,
      logout,
      userValidated,
      setUserValidated,
      googleLogin,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};