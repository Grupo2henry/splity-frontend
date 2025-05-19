// src/services/fetchUsersByEmail.ts
export const fetchUsersByEmail = async (email: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No hay token disponible. El usuario no está autenticado.");
      }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/search/email?q=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }
  
    return response.json();
  };
  