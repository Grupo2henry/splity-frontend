import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./authContext/authContext";

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
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "6");
      if (search) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(
        `http://localhost:4000/AdminMembershipsUser/${userId}?${queryParams}`,
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
