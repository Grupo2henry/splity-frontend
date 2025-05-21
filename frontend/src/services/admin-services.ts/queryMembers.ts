"use client";
import { useQuery } from "@tanstack/react-query";
// src/services/fetchUsersByEmail.ts

export const useMembersAdmin = (
  groupId: string,
  page: number,
  token: string | null
) => {
  return useQuery({
    queryKey: ["members", groupId, page],
    queryFn: async () => {
      if (!token) {
        throw new Error(
          "No hay token disponible. El usuario no está autenticado."
        );
      }
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "6");

      const res = await fetch(
        `http://localhost:4000/MembershipsOfGroup/${groupId}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error fetching groups");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};
