export const fetchGoogleLogin = async (credential: string) => {
    try {
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google-authentication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: credential,
          }),
        }
      );
  
      if (!apiResponse.ok) {
        throw new Error(`Error: ${apiResponse.status}`);
      }
  
      const responseData = await apiResponse.json();
      const token = responseData.access_token; // El token ahora está directamente en responseData.access_token
  
      return token;
    } catch (error) {
      console.error("Error en la autenticación:", error);
      throw error; // Re-lanza el error para que el componente pueda manejarlo
    }
  };