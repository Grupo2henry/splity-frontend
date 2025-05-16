/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/MembershipContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGroup } from "./GroupContext";
import { useAuth } from "./AuthContext"; // Importa el AuthContext
import { fetchGetMembersByGroupId } from "@/services/fetchGetMembersByGroupId";
import { fetchGetUserMemberships } from "@/services/fetchGetUserMemberships";
import { MembershipContextType, Membership, UserMembership } from "./interfaces/memberships.interfaces"; // Asegúrate de tener UserMembership en tus interfaces

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
  const [actualGroupRole, setActualGroupRole] = useState<string | null>(null);
  const { actualGroup } = useGroup();
  const { user } = useAuth(); // Obtén el estado del usuario

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
    if (actualGroup?.id) {
      getParticipantsByGroupId(actualGroup.id.toString());
      // Actualizar el rol del usuario en el grupo actual
      if (user && userMemberships.length > 0) {
        const membership = userMemberships.find(
          (mem) => mem.group.id === actualGroup.id
        );
        setActualGroupRole(membership?.role || null);
      } else {
        setActualGroupRole(null);
      }
    } else {
      setParticipants([]);
      setActualGroupRole(null);
    }
  }, [actualGroup, user, userMemberships]);

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
        actualGroupRole,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};