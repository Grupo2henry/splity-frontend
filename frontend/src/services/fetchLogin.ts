// src/services/fetchLogin.ts
import { IFormLogin } from "@/components/FormLogin/types";

export const fetchLogin = async (data: IFormLogin) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
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
      return responseData; // Devuelve la respuesta completa para mayor flexibilidad
    } else {
      console.warn("No se encontró token en la respuesta del login tradicional");
      throw new Error("No se recibió el token de autenticación.");
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return Promise.reject(error);
  }
};

export default fetchLogin;