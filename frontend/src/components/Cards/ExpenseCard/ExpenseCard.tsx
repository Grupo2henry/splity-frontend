// src/components/Listing_Expense/Listing_Expense.tsx
"use client";

import Image from "next/image";
import { Expense } from "@/context/interfaces/expense.interface";
import Link from 'next/link';
import { useExpenses } from "@/context/ExpensesContext"; // Importa el contexto
import { useMembership } from "@/context/MembershipContext"; // Importa el contexto de membresía
import styles from "./ExpenseCard.module.css";

interface ListingExpenseProps {
  expense: Expense;
}

export const ExpenseCard = ({ expense }: ListingExpenseProps) => {
  const { deactivateExpense } = useExpenses(); // Obtén la función del contexto
  const { actualGroupMembership } = useMembership(); // Obtén la información del grupo actual

  const handleDeleteClick = async () => {
    console.log("Eliminar gasto:", expense.id);
    if (actualGroupMembership?.group.id) {
      await deactivateExpense(expense.id.toString(), actualGroupMembership.group.id.toString());
    } else {
      console.warn("No se pudo eliminar el gasto: ID del grupo no encontrado.");
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className={styles.expenseCard}>
      <div className={styles.cardContent}>
        <Link href={`/Update_Spent/${expense.id}`} className={styles.expenseInfo}>
          <Image src="/image7.svg" alt="Logo" width={25} height={25} />
          <div className={styles.textContainer}>
            <p className={styles.description}>{expense.description}</p>
            <p className={styles.paidBy}>Pagado por {expense.paid_by?.name}</p>
          </div>
          <p className={styles.amount}>AR${expense.amount}</p>
        </Link>
        <button
          className={styles.deleteButton}
          onClick={handleDeleteClick}
          aria-label="Eliminar gasto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};