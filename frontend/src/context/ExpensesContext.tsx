/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ExpensesContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IFormGasto } from "@/components/Forms/ExpensesForm/types";
import { Expense } from "./interfaces/expense.interface";
import { fetchCreateExpense } from "@/services/expenses-services/fetchCreateExpense";
import { fetchGetExpensesByGroupId } from "@/services/expenses-services/fetchGetExpensesByGroupId";
import { fetchGetExpenseById } from "@/services/expenses-services/fetchGetExpenseById";
import { fetchUpdateExpense } from "@/services/expenses-services/fetchUpdateExpense";
import { fetchDeactivateExpense } from "@/services/expenses-services/fetchDeactivateExpense"; // Importa el nuevo servicio
import { useMembership } from "./MembershipContext";
import { useRouter } from "next/navigation";

interface ExpensesContextType {
  expenses: Expense[];
  expenseErrors: string[];
  loadingExpenses: boolean;
  setLoadingExpenses: (loading: boolean) => void;
  createExpense: (expenseData: IFormGasto, groupId: string) => Promise<Expense>;
  getExpensesByGroupId: (groupId: string) => Promise<void>;
  getExpenseById: (expenseId: string) => Promise<Expense | null>;
  updateExpense: (expenseData: IFormGasto, expenseId: string, groupId: string) => Promise<Expense>;
  deactivateExpense: (expenseId: string, groupId: string) => Promise<void>; // Nuevo método
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
  const { actualGroupMembership } = useMembership();
  const router = useRouter();

  useEffect(() => {
    if (expenseErrors.length > 0) {
      const timer = setTimeout(() => setExpenseErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [expenseErrors]);

  useEffect(() => {
    if (actualGroupMembership?.group.id) {
      getExpensesByGroupId(actualGroupMembership.group.id.toString());
    } else {
      setExpenses([]);
    }
  }, [actualGroupMembership]);

  const createExpense = async (expenseData: IFormGasto, groupId: string): Promise<Expense> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      const createdExpense = await fetchCreateExpense(expenseData, Number(groupId), token);
      await getExpensesByGroupId(groupId);
      if (actualGroupMembership?.group.id) {
        router.push(`/Event_Details/${actualGroupMembership.group.id.toString()}`);
      }
      return createdExpense;
    } catch (error: any) {
      console.error("Error al crear el gasto:", error);
      setExpenseErrors([error.message || "Error al crear el gasto."]);
      throw error;
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

  const updateExpense = async (expenseData: IFormGasto, expenseId: string, groupId: string): Promise<Expense> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      const updatedExpense = await fetchUpdateExpense(expenseData, Number(expenseId), token);
      await getExpensesByGroupId(groupId);
      if (actualGroupMembership?.group.id) {
        router.push(`/Event_Details/${actualGroupMembership.group.id.toString()}`);
      }
      return updatedExpense;
    } catch (error: any) {
      console.error("Error al actualizar el gasto:", error);
      setExpenseErrors([error.message || "Error al actualizar el gasto."]);
      throw error;
    } finally {
      setLoadingExpenses(false);
    }
  };

  const deactivateExpense = async (expenseId: string, groupId: string): Promise<void> => {
    setLoadingExpenses(true);
    setExpenseErrors([]);
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
      await fetchDeactivateExpense(expenseId, token);
      await getExpensesByGroupId(groupId); // Recargar los gastos después de la desactivación
    } catch (error: any) {
      console.error(`Error al desactivar el gasto con ID ${expenseId}:`, error);
      setExpenseErrors([error.message || "Error al desactivar el gasto."]);
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
      updateExpense,
      deactivateExpense, // Añade el nuevo método al contexto
    }}>
      {children}
    </ExpensesContext.Provider>
  );
};