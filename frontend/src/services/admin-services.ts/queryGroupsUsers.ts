import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

export const useGroupsAdmin = (
  userId: string,
  page: number,
  search: string,
  startDate: string,
  endDate: string
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["groupsOfUser", userId, page, search, startDate, endDate],
    queryFn: async () => {
      console.log("el token de groups of user es", token);
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "6");
      if (search) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/AdminMembershipsUser/${userId}?${queryParams}`,
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
