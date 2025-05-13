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
      const errorData = await apiResponse.json();
      throw new Error(errorData.message || `Error: ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    const token = responseData.access_token;

    if (token) {
      localStorage.setItem('token', token);
    } else {
      console.warn("No se encontró token en la respuesta de Google Authentication");
    }

    return token;
  } catch (error) {
    console.error("Error en la autenticación con Google:", error);
    throw error;
  }
};