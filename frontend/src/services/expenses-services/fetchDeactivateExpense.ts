// src/services/fetchDeactivateExpense.ts

export const fetchDeactivateExpense = async (expenseId: string, token: string) => {
  console.log(`expenseId: ${expenseId}`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}/toggle-active`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    // El controller no espera un body, así que lo eliminamos
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `Error al cambiar el estado del gasto (status ${response.status})`);
  }

  const result = await response.json();
  return result;
};