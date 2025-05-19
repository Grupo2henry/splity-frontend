// src/services/fetchUpdateExpense.ts

import { IFormGasto } from "@/components/Forms/ExpensesForm/types";

export const fetchUpdateExpense = async (data: IFormGasto, expenseId: number, token: string) => {
  console.log(`Data: ${data} | expenseId: ${expenseId} | `)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}`, {
    method: 'PATCH',
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
};