export interface Expense {
  id: number;
  description: string;
  active: boolean;
  amount: number;
  created_at: string;
  date: string;
  imgUrl: string | null;
  paid_by: { // Suponiendo que también recibes información sobre quién pagó
    id: number;
    name: string;
    email: string;
    // ... otras propiedades del usuario pagador si las hay
  };
  // Podría haber otras propiedades dependiendo de tu backend
}