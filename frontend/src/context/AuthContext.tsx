/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser } from "./interfaces/user.interface";
import { IFormLogin } from "@/components/FormLogin/types";
import { IFormRegister } from "@/components/FormRegister/types";
import { fetchLogin } from "@/services/fetchLogin";
import { fetchRegister } from "@/services/fetchRegister";
import { fetchGetUser } from "@/services/fetchGetUser";
import { fetchGoogleLogin } from "@/services/fetchGoogleLogin";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  errors: string[];
  login: (credentials: IFormLogin) => Promise<void>;
  register: (credentials: IFormRegister) => Promise<void>;
  logout: () => void;
  userValidated: boolean;
  setUserValidated: (isValidated: boolean) => void;
  googleLogin: (credential: string) => Promise<void>;
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
  const [user, setUser] = useState<IUser | null>(null);
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
      const token = responseData?.access_token;
      if (token) {
        localStorage.setItem('token', token);
        const userData = await fetchGetUser(token);
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
      const token = await fetchGoogleLogin(credential);
      localStorage.setItem('token', token);
      const userData = await fetchGetUser(token);
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
      console.log("Registro exitoso");
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
      const token = localStorage.getItem("token");
      if (!token) {
        setUserValidated(true);
        return;
      }
      try {
        const userData = await fetchGetUser(token);
        setUser(userData);
        setUserValidated(true);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          console.warn("Token expirado o inválido. Cerrando sesión...");
        } else {
          console.error("Error al verificar el token:", error.message);
        }
        localStorage.removeItem("token");
        setUser(null);
        setUserValidated(true); // para mostrar la UI de login
        router.push("/Login");
      }
    };

    verifyToken();
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      errors,
      login,
      register,
      logout,
      userValidated,
      setUserValidated,
      googleLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
