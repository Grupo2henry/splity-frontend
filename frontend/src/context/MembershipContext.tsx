/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/MembershipContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext"; // Importa el AuthContext
import { fetchGetMembersByGroupId } from "@/services/fetchGetMembersByGroupId";
import { fetchGetUserMemberships } from "@/services/fetchGetUserMemberships";
import { fetchGetActualGroupUserMembership } from "@/services/fetchGetActualGroupUserMembership";
import {
  MembershipContextType,
  Membership,
  UserMembership,
  ActualGroupMembership, // Importa la nueva interfaz
} from "./interfaces/memberships.interfaces";
import { usePathname } from "next/navigation";

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const useMembership = (): MembershipContextType => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership debe usarse dentro de un MembershipProvider");
  }
  return context;
};

export const MembershipProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Membership[]>([]);
  const [participantsErrors, setParticipantsErrors] = useState<string[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  const [userMembershipsErrors, setUserMembershipsErrors] = useState<string[]>([]);
  const [loadingUserMemberships, setLoadingUserMemberships] = useState(false);
  const [actualGroupMembership, setActualGroupMembership] = useState<ActualGroupMembership| null>(null);
  const [actualGroupMembershipErrors, setActualGroupMembershipErrors] = useState<string[]>([]);
  const [loadingActualGroupUserMembership, errorLoadingActualGroupUserMembership] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const isEventDetailsRoute = pathname.startsWith("/Event_Details/");
    const isAddSpentRoute = pathname.startsWith("/Add_Spent/");
    if (!isEventDetailsRoute && !isAddSpentRoute) {
      setActualGroupMembership(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (participantsErrors.length > 0) {
      const timer = setTimeout(() => setParticipantsErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [participantsErrors]);

  useEffect(() => {
    if (userMembershipsErrors.length > 0) {
      const timer = setTimeout(() => setUserMembershipsErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [userMembershipsErrors]);

  useEffect(() => {
    if (user) {
      fetchUserMemberships();
    } else {
      setUserMemberships([]);
    }
  }, [user]);

  const getParticipantsByGroupId = async (groupId: string): Promise<void> => {
    setLoadingParticipants(true);
    setParticipantsErrors([]);

    const token = localStorage.getItem("token");
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      const response = await fetchGetMembersByGroupId(token, groupId);
      console.log("Usuarios de MembershipContext: ", response);
      setParticipants(response);
    } catch (error: any) {
      console.error(`Error al obtener los participantes del grupo ${groupId}:`, error);
      setParticipantsErrors([error.message || "Error al obtener los participantes."]);
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const fetchUserMemberships = async (): Promise<void> => {
    setLoadingUserMemberships(true);
    setUserMembershipsErrors([]);
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const memberships = await fetchGetUserMemberships(token);
        setUserMemberships(memberships);
        console.log("Membresias desde el back: ",memberships)
      } else {
        setUserMemberships([]);
      }
    } catch (error: any) {
      console.error("Error al obtener las membresías del usuario:", error);
      setUserMembershipsErrors([
        error.message || "Error al obtener las membresías del usuario.",
      ]);
      setUserMemberships([]);
    } finally {
      setLoadingUserMemberships(false);
    }
  };

  const getActualGroupUserMembership = async (groupId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación para obtener la membresía del grupo actual.");
      return;
    }
    errorLoadingActualGroupUserMembership(true);
    try {
      const response: ActualGroupMembership = await fetchGetActualGroupUserMembership(token, groupId);
      console.log("Membresía del usuario en el grupo actual: ", response);
      setActualGroupMembership(response);
    } catch (error: any) {
      console.error(`Error al obtener la membresía del usuario en el grupo ${groupId}:`, error);
      setActualGroupMembershipErrors([error.message || "Error al obtener la membresía del grupo actual"]);
      setActualGroupMembership(null);
    } finally {
      errorLoadingActualGroupUserMembership(false);
    }
  };

  return (
    <MembershipContext.Provider
      value={{
        participants,
        participantsErrors,
        loadingParticipants,
        getParticipantsByGroupId,
        userMemberships,
        userMembershipsErrors,
        loadingUserMemberships,
        fetchUserMemberships,
        actualGroupMembership,
        setActualGroupMembership,
        actualGroupMembershipErrors,
        loadingActualGroupUserMembership,
        getActualGroupUserMembership
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};