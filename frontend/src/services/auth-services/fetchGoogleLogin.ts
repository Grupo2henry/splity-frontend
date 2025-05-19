// src/services/fetchGoogleLogin.ts
export const fetchGoogleLogin = async (credential: string) => {
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

  if (!token) {
    console.warn("No se encontró token en la respuesta de Google Authentication");
    throw new Error("No se recibió el token de autenticación de Google.");
  }

  return token;
};