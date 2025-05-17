/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/GroupContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Group } from "./interfaces/groups.interfaces"; 
import { fetchCreateGroup } from "@/services/fetchCreateGroup"; 
import { fetchGetMyGroups } from "@/services/fetchGetMyGroups"; 
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { GroupContextType } from "./interfaces/groups.interfaces";


const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup debe usarse dentro de un GroupProvider");
  }
  return context as GroupContextType;
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [memberGroups, setMemberGroups] = useState<Group[]>([]);
  const [adminGroups, setAdminGroups] = useState<Group[]>([]);
  const [groupErrors, setGroupErrors] = useState<string[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // Obtén el estado del usuario del AuthContex

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
      await fetchMemberGroups();
      await fetchAdminGroups();
      router.push("/Dashboard");
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


  useEffect(() => {
    if (user) {
      fetchMemberGroups();
      fetchAdminGroups();
    } else {
      setMemberGroups([]);
      setAdminGroups([]);
    }
  }, [user]);

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
      setLoadingGroups
    }}>
      {children}
    </GroupContext.Provider>
  );
};