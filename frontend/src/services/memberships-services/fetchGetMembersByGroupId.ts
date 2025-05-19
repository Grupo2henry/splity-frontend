// src/services/fetchGetMyGroups.ts
export const fetchGetMembersByGroupId = async (token: string, groupId: string) => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${Number(groupId)}/members`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
      throw new Error(errorData?.message || `Error al obtener el grupo (status ${response.status})`);
  }
  return await response.json();
};