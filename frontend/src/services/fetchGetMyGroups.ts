export const fetchGetMyGroups = async (
    role?: 'ADMIN' | 'MEMBER' // 👈 Define el tipo opcional para el rol
  ) => {
    try {
      const token = localStorage.getItem("token") || "";
      let url = `${process.env.NEXT_PUBLIC_API_URL}/users/me/groups`;
  
      // Agrega el parámetro 'role' a la URL si se proporciona
      if (role) {
        url += `?role=${role}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  
  export default fetchGetMyGroups;