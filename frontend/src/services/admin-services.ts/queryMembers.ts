import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
// src/services/fetchUsersByEmail.ts
export const useMembers = (groupId: string, page: number) => {
  const { token } = useAuth();
  if (!token) {
    throw new Error("No hay token disponible. El usuario no está autenticado.");
  }
  return useQuery({
    queryKey: ["members", groupId, page],
    queryFn: async () => {
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
  });
};
