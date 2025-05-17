// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./authContext/authContext";

export const useUsers = (page: number, search: string) => {
  const { token } = useAuth();
  console.log("el token esta?", token);
  return useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/users/usersByAdmin?page=${page}&limit=6&search=${search}`,
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
