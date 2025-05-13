// src/services/fetchGoogleLogin.ts
export const fetchGoogleLogin = async (credential: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google-authentication`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: credential,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const responseData = await response.json();
    const token = responseData.access_token;

    if (token) {
      localStorage.setItem('token', token);
      return token; // Devuelve solo el token, consistente con la versión anterior
    } else {
      console.warn("No se encontró token en la respuesta de Google Authentication");
      throw new Error("No se recibió el token de autenticación de Google.");
    }
  } catch (error) {
    console.error("Error en la autenticación con Google:", error);
    throw error;
  }
};