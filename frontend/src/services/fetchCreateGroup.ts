// src/services/fetchCreateGroup.ts
import { IFormEvent } from "@/components/Event_Form/types";

export const fetchCreateGroup = async (data: IFormEvent, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error creating group: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

export default fetchCreateGroup;