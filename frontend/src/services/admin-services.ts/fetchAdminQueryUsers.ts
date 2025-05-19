export const fetchAdminQueryUsers = async (token: string, page: number, limit: number) => {
  const respose = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/admin/all?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!respose.ok) throw new Error("Error fetching users");
  return await respose.json();
};

    



    