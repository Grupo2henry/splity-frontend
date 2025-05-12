// src/services/fetchGetMyGroups.ts
export const fetchGetMyGroups = async (role?: 'ADMIN' | 'MEMBER') => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No estás logueado");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/users/me/groups`;
  if (role) url += `?role=${role}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Error al obtener los grupos");
  }

  return await response.json();
};
