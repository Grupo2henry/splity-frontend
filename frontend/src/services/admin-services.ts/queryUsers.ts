// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

export const useUsers = (
  page: number,
  search: string,
  token: string | null,
  active: string
) => {
  console.log("el token esta?", token);
  return useQuery({
    queryKey: ["users", page, search, active],
    queryFn: async () => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/users/usersAdmin`
      );
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", "8");
      url.searchParams.append("search", search);
      if (active) {
        url.searchParams.append("active", active);
      }
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error fetching users");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
  });
};
