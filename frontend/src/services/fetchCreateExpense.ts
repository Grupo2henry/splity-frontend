/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/fetchCreateExpense.ts

import { IFormGasto } from "@/components/Add_Expenses/types";

export const fetchCreateExpense = async (data: IFormGasto, groupId: number, token: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/expenses`, {
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
      throw new Error(errorData?.message || `Error al crear el gasto (status ${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error en fetchCreateExpense:", error);
    throw error; // Relanza el error para que lo capture el contexto
  }
};