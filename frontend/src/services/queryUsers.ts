// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

export const useUsers = (
  page: number,
  search: string,
  token: string | null
) => {
  console.log("el token esta?", token);
  return useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/usersAdmin?page=${page}&limit=8&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error fetching users");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
  });
};
