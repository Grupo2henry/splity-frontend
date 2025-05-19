import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./authContext/authContext";

// Interfaz para los datos del grupo
export interface GroupDetails {
  id: string;
  name: string;
  created_at: string;
  created_by: { id: string; name: string; email: string };
  membershipCount: number;
  expenseCount: number;
  active: boolean;
}

// Hook personalizado para obtener detalles de un grupo
export const useGroupDetails = (groupId: string) => {
  /**agregar token despues */
  const { token } = useAuth();
  return useQuery<GroupDetails, Error>({
    queryKey: ["detailsOfGroup", groupId],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token provided");
      }
      const res = await fetch(
        `http://localhost:4000/DetailsOfGroup/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error fetching details of group");
      }
      return res.json();
    },
    placeholderData: (previousData) => previousData,
    // enabled: !!token && !!groupId, // Solo ejecuta la consulta si hay token y groupId
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};
