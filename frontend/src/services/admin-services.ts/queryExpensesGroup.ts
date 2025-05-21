import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useExpensesOfGroups = (
  groupId: string,
  page: number,
  search: string,
  startDate: string,
  endDate: string,
  sinceAmount: string,
  untilAmount: string
) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: [
      "expensesOfGroup",
      groupId,
      page,
      search,
      startDate,
      endDate,
      sinceAmount,
      untilAmount,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", "6");
      if (search) queryParams.append("search", search);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (sinceAmount) queryParams.append("sinceAmount", sinceAmount);
      if (untilAmount) queryParams.append("untilAmount", untilAmount);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ExpensesOfGroup/${groupId}?${queryParams}`,
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
