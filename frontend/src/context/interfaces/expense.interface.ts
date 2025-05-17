export interface Expense {
  id: number;
  description: string;
  active: boolean;
  amount: number;
  created_at: string;
  date: string;
  imgUrl: string | null;
  paid_by: {
    id: number;
    name: string;
    email: string;
    // ... otras propiedades del usuario pagador si las hay
  };
  // Podría haber otras propiedades dependiendo de tu backend
}