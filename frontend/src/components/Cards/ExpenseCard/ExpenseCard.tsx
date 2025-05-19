// src/components/Listing_Expense/Listing_Expense.tsx
"use client";

import Image from "next/image";
import { Expense } from "@/context/interfaces/expense.interface";
import Link from 'next/link';
import { useExpenses } from "@/context/ExpensesContext"; // Importa el contexto
import { useMembership } from "@/context/MembershipContext"; // Importa el contexto de membresía

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
    <div className="flex flex-col w-full px-2 bg-[#d9d9d9] rounded-lg" >
      <div className="flex flex-row justify-between items-center">
        <Image src="/image7.svg" alt="Logo" width={25} height={25} />
        <Link
          href={`/Update_Spent/${expense.id}`}
          className="flex flex-col w-full"
        >
          <div className="flex w-full gap-2">
            <div className="flex flex-col w-full ml-2">
              <p className="font-bold">{expense.description}</p>
              <p className="text-sm">Pagado por {expense.paid_by?.name}</p>
            </div>
            <p className="font-bold text-md">AR${expense.amount}</p>
          </div>
        </Link>
        {/* Botón de eliminar con onClick que llama a la función del contexto */}
        <button
          className="text-red-500 hover:text-red-700 focus:outline-none"
          onClick={handleDeleteClick}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};