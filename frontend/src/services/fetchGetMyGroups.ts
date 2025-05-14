// src/services/fetchGetMyGroups.ts
export const fetchGetMyGroups = async (token: string, role?: 'ADMIN' | 'MEMBER') => {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/users/me/groups`;
  if (role) {
    url += `?role=${role}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || `Error al obtener los grupos (${role || 'todos'})`);
  }
  return await response.json();
};