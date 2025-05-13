// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import fetchGetUser from "@/services/fetchGetUser";

export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_picture_url: string | null;
  is_premium: boolean;
  role: string;
  active: boolean;
  created_at: string;
  total_groups_created: number;
}

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  triggerUserReload: () => void; // Agrega la nueva propiedad a la interfaz
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginStatusChanged, setLoginStatusChanged] = useState(false); // Nuevo estado

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    console.log("Estoy en user Context, este es el token: ", token);

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const getUserData = async () => {
      try {
        const fetchedUser = await fetchGetUser(token);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [loginStatusChanged]); // Se re-ejecuta cuando loginStatusChanged cambia

  const triggerUserReload = () => {
    setLoginStatusChanged(prev => !prev);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, triggerUserReload }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType & { triggerUserReload: () => void } => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context as UserContextType & { triggerUserReload: () => void };
};