/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/GroupContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IGroup } from "@/components/Card_Dashboard/types"; // Asegúrate de tener esta interfaz
import { fetchCreateGroup } from "@/services/fetchCreateGroup"; // Asegúrate de tener este servicio
import { fetchGetMyGroups } from "@/services/fetchGetMyGroups"; // Asegúrate de tener este servicio
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext"; // Importa el AuthContext

interface GroupContextType {
  memberGroups: IGroup[];
  setMemberGroups: (groups: IGroup[]) => void;
  adminGroups: IGroup[];
  setAdminGroups: (groups: IGroup[]) => void;
  groupErrors: string[];
  createGroup: (groupData: any) => Promise<void>; // Ajusta el tipo de groupData
  fetchMemberGroups: () => Promise<void>;
  fetchAdminGroups: () => Promise<void>;
  loadingGroups: boolean;
  setLoadingGroups: (loading: boolean) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup debe usarse dentro de un GroupProvider");
  }
  return context as GroupContextType;
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [memberGroups, setMemberGroups] = useState<IGroup[]>([]);
  const [adminGroups, setAdminGroups] = useState<IGroup[]>([]);
  const [groupErrors, setGroupErrors] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // Obtén el estado del usuario del AuthContext

  useEffect(() => {
    if (groupErrors.length > 0) {
      const timer = setTimeout(() => setGroupErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [groupErrors]);

  const createGroup = async (groupData: any): Promise<void> => {
    setLoadingGroups(true);
    setGroupErrors([]);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      await fetchCreateGroup(groupData, token);
      // Después de crear el grupo, recargamos ambas listas
      await fetchMemberGroups();
      await fetchAdminGroups();
      router.push("/Dashboard"); // O donde quieras redirigir
    } catch (error: any) {
      console.error("Error al crear el grupo:", error);
      setGroupErrors([error.message || "Error al crear el grupo."]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchMemberGroups = async (): Promise<void> => {
    setLoadingGroups(true);
    setGroupErrors([]);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás logueado");
      }
      const fetchedGroups = await fetchGetMyGroups(token, "MEMBER");
      setMemberGroups(fetchedGroups);
    } catch (error: any) {
      console.error("Error al obtener los grupos como miembro:", error);
      setGroupErrors([error.message || "Error al obtener los grupos."]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchAdminGroups = async (): Promise<void> => {
    setLoadingGroups(true);
    setGroupErrors([]);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No estás logueado");
      }
      const fetchedGroups = await fetchGetMyGroups(token, "ADMIN");
      setAdminGroups(fetchedGroups);
    } catch (error: any) {
      console.error("Error al obtener los grupos creados:", error);
      setGroupErrors([error.message || "Error al obtener los grupos."]);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Efecto para cargar los grupos iniciales al loguearse el usuario
  useEffect(() => {
    if (user) {
      fetchMemberGroups();
      fetchAdminGroups();
    } else {
      // Limpiar los estados de los grupos al desloguearse
      setMemberGroups([]);
      setAdminGroups([]);
    }
  }, [user]); // Dependencia en el estado 'user' del AuthContext

  return (
    <GroupContext.Provider value={{
      memberGroups,
      setMemberGroups,
      adminGroups,
      setAdminGroups,
      groupErrors,
      createGroup,
      fetchMemberGroups,
      fetchAdminGroups,
      loadingGroups,
      setLoadingGroups,
    }}>
      {children}
    </GroupContext.Provider>
  );
};