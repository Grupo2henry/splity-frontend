interface UserDetails {
  id: string;
  name: string;
  email: string
  profile_picture_url?: string;
  created_at: string;
  active: boolean;
}

export const fetchUserDetails = async (): Promise<UserDetails> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token disponible. El usuario no está autenticado.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export default fetchUserDetails; 