import { IFormRegister } from "@/components/FormRegister/types";

export const fetchRegister = async (data: IFormRegister) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message);
  }
  return await response.json();
};
