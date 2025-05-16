export const fetchGetGroupById = async (slug: string, token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/id/${Number(slug)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Error al obtener el grupo (status ${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error en fetchGetGroupById:", error);
    throw error; // Relanza el error para que lo capture el GroupContext
  }
};