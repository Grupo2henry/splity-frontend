// src/context/AdminContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchAdminQueryUsers } from "@/services/fetchAdminQueryUsers";
import { useAuth } from "./AuthContext";

// Definición de la interfaz para un usuario (ajústala según tu modelo)
interface AdminPanelUsers {
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

interface AdminContextType {
  allUsers: AdminPanelUsers[];
  loadingAllUsers: boolean;
  allUsersErrors: string[];
  fetchAllUsers: (
    page: number,
    limit: number
  ) => Promise<
    | {
        data: AdminPanelUsers[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
      }
    | undefined
  >;
  currentPage: number;
  totalPages: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin debe usarse dentro de un AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // <- usamos el contexto de autenticación

  const [allUsers, setAllUsers] = useState<AdminPanelUsers[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [allUsersErrors, setAllUsersErrors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Limpia errores luego de 5s
  useEffect(() => {
    if (allUsersErrors.length > 0) {
      const timer = setTimeout(() => setAllUsersErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [allUsersErrors]);

  // Limpia todos los estados si el usuario no es ADMIN
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      setAllUsers([]);
      setAllUsersErrors([]);
      setCurrentPage(1);
      setTotalPages(1);
      setLoadingAllUsers(false);
    }
  }, [user]);

  const fetchAllUsers = async (
    page: number,
    limit: number
  ): Promise<
    | {
        data: AdminPanelUsers[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
      }
    | undefined
  > => {
    if (!user || user.role !== "ADMIN") return undefined; // Protección extra

    setLoadingAllUsers(true);
    setAllUsersErrors([]);
    setCurrentPage(page);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación.");

      const response = await fetchAdminQueryUsers(token, page, limit);
      if (response) {
        setAllUsers(response.data);
        setTotalPages(response.lastPage);
        return response;
      }
      return undefined;
    } catch (error: any) {
      console.error(`Error al obtener la página ${page} de usuarios:`, error);
      setAllUsersErrors([
        error.message || "Error al obtener la lista de usuarios.",
      ]);
      setAllUsers([]);
      setTotalPages(1);
      return undefined;
    } finally {
      setLoadingAllUsers(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        allUsers,
        loadingAllUsers,
        allUsersErrors,
        fetchAllUsers,
        currentPage,
        totalPages,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
