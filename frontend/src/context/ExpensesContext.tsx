/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ExpensesContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IFormGasto } from "@/components/Add_Expenses/types";
import { Expense } from "./interfaces/expense.interface"; // Asegúrate de tener esta interfaz
import { fetchCreateExpense } from "@/services/fetchCreateExpense";
import { fetchGetExpensesByGroupId } from "@/services/fetchGetExpensesByGroupId"; // Servicio a crear
import { fetchGetExpenseById } from "@/services/fetchGetExpenseById"; // Servicio a crear
import { useGroup } from "./GroupContext"; // Importa el GroupContext
import { useRouter } from "next/navigation"; // Importa el useRouter

interface ExpensesContextType {
  expenses: Expense[];
  expenseErrors: string[];
  loadingExpenses: boolean;
  setLoadingExpenses: (loading: boolean) => void;
  createExpense: (expenseData: IFormGasto, groupId: string) => Promise<void>;
  getExpensesByGroupId: (groupId: string) => Promise<void>;
  getExpenseById: (expenseId: string) => Promise<Expense | null>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const useExpenses = (): ExpensesContextType => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses debe usarse dentro de un ExpensesProvider");
  }
  return context as ExpensesContextType;
};

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseErrors, setExpenseErrors] = useState<string[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const { actualGroup } = useGroup(); // Obtén actualGroup del GroupContext
  const router = useRouter(); // Inicializa el router

  useEffect(() => {
    if (expenseErrors.length > 0) {
      const timer = setTimeout(() => setExpenseErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [expenseErrors]);

  useEffect(() => {
    if (actualGroup?.id) {
      getExpensesByGroupId(actualGroup.id.toString());
    } else {
      setExpenses([]);
    }
  }, [actualGroup]);

  const createExpense = async (expenseData: IFormGasto, groupId: string): Promise<void> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      await fetchCreateExpense(expenseData, Number(groupId), token);
      // Después de crear el gasto, recargamos la lista de gastos del grupo
      await getExpensesByGroupId(groupId);
      // Redirigir a la página de detalles del evento
      if (actualGroup) {
        router.push(`/Event_Details/${actualGroup}`);
      } else {
        console.warn("No se pudo redirigir a los detalles del evento porque actualGroup.slug es undefined.");
        // Puedes agregar una redirección por defecto aquí si es necesario
      }
    } catch (error: any) {
      console.error("Error al crear el gasto:", error);
      setExpenseErrors([error.message || "Error al crear el gasto."]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const getExpensesByGroupId = async (groupId: string): Promise<void> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      const fetchedExpenses = await fetchGetExpensesByGroupId(groupId, token);
      setExpenses(fetchedExpenses);
    } catch (error: any) {
      console.error(`Error al obtener los gastos del grupo ${groupId}:`, error);
      setExpenseErrors([error.message || "Error al obtener los gastos."]);
      setExpenses([]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const getExpenseById = async (expenseId: string): Promise<Expense | null> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      const fetchedExpense = await fetchGetExpenseById(expenseId, token);
      return fetchedExpense;
    } catch (error: any) {
      console.error(`Error al obtener el gasto con ID ${expenseId}:`, error);
      setExpenseErrors([error.message || "Error al obtener el gasto."]);
      return null;
    } finally {
      setLoadingExpenses(false);
    }
  };

  return (
    <ExpensesContext.Provider value={{
      expenses,
      expenseErrors,
      loadingExpenses,
      setLoadingExpenses,
      createExpense,
      getExpensesByGroupId,
      getExpenseById,
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};