/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/MembershipContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGroup } from "./GroupContext";
import { fetchGetMembersByGroupId } from "@/services/fetchGetMembersByGroupId";

interface User {
  id: string;
  name: string;
  email: string;
  // Agregá más campos si tu modelo de usuario los tiene
}

interface Membership {
  user: User;
  role: string;
  // Otros campos si los necesitás
}

interface MembershipContextType {
  participants: Membership[];
  participantsErrors: string[];
  loadingParticipants: boolean;
  getParticipantsByGroupId: (groupId: string) => Promise<void>;
}

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
  const { actualGroup } = useGroup();

  useEffect(() => {
    if (participantsErrors.length > 0) {
      const timer = setTimeout(() => setParticipantsErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [participantsErrors]);

  useEffect(() => {
    if (actualGroup?.id) {
      getParticipantsByGroupId(actualGroup.id.toString());
    } else {
      setParticipants([]);
    }
  }, [actualGroup]);

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

  return (
    <MembershipContext.Provider value={{
      participants,
      participantsErrors,
      loadingParticipants,
      getParticipantsByGroupId
    }}>
      {children}
    </MembershipContext.Provider>
  );
};
