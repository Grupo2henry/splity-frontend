/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/fetchGetExpensesByGroupId.ts

import { Expense } from "../context/interfaces/expense.interface"; // Asegúrate de tener esta interfaz

export const fetchGetExpensesByGroupId = async (groupId: string, token: string): Promise<Expense[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/expenses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `Error al obtener los gastos del grupo (status ${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error en fetchGetExpensesByGroupId:", error);
    throw error; // Relanza el error para que lo capture el contexto
  }
};