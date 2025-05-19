// src\services\admin-services\queryGroupGeneral.ts
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export const useExpensesGeneral = (
  page: number,
  search: string,
  startDate: string,
  endDate: string,
  active: string // Nuevo parámetro
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["groupsOfUser", page, search, startDate, endDate, active], // Incluir active en queryKey
    queryFn: async () => {
      console.log("El token de groups of user es", token);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "8");
      if (search) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (active) queryParams.append("active", active); // Añadir filtro active

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminExpensesGeneral?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error fetching groups");
      return res.json();
    },
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
};
