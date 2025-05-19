// src/services/fetchLogin.ts
import { IFormLogin } from "@/components/Forms/LoginForm/types";

export const fetchLogin = async (data: IFormLogin) => {
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

  return await response.json();
};
