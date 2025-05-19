/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/fetchGetExpenseById.ts

import { Expense } from "../../context/interfaces/expense.interface"; // Asegúrate de tener esta interfaz

export const fetchGetExpenseById = async (expenseId: string, token: string): Promise<Expense | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        return null; // El gasto no se encontró
      }
      throw new Error(errorData?.message || `Error al obtener el gasto (status ${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error en fetchGetExpenseById:", error);
    throw error; // Relanza el error para que lo capture el contexto
  }
};