// src/components/Expenses_Card/Expenses_Card.tsx
"use client"

import { useEffect, useState } from "react";
import { formatDate } from "./dateFuntion";
import { useExpenses } from "@/context/ExpensesContext";
import { useAuth } from "@/context/AuthContext";
import { Expense } from "@/context/interfaces/expense.interface";
import { ExpenseCard } from "@/components/Cards/ExpenseCard/ExpenseCard"; // Importa el nuevo componente

interface GroupedExpenses {
  [date: string]: Expense[];
}

export const Expenses_Card = () => {
  const { expenses } = useExpenses();
  const { user } = useAuth();
  const [grouped, setGrouped] = useState<GroupedExpenses>({});

  const totalExpenses = expenses?.map((expense) => expense.amount).reduce((a, b) => a + b, 0) || 0;

  const totalPaidByMe = expenses?.filter((expense) => expense.paid_by?.id && user?.id && String(expense.paid_by.id) === user.id)
    .map((expense) => expense.amount)
    .reduce((a, b) => a + b, 0) || 0;

  useEffect(() => {
    const groupedByDate: GroupedExpenses = {};
    for (const expense of expenses || []) {
      const date = formatDate(expense.date.toString());
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(expense);
    }
    setGrouped(groupedByDate);
  }, [expenses]);

  return (
    <>
      <div className="flex w-full h-full items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-[#FFFFFF] text-center">Mis gastos</p>
          <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
            <p className="custom-input font-bold">AR$ {totalPaidByMe}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-[#FFFFFF] text-center">Gastos grupales</p>
          <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
            <p className="custom-input font-bold">AR$ {totalExpenses}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-full items-center">
        <div className="flex flex-col w-full gap-6">
          {Object.entries(grouped).map(([date, expenses]) => (
            <div key={date} className="flex flex-col gap-1 ">
              <p className="text-[16px] text-start text-[#FFFFFF]">{date}</p>
              <div className="rounded-lg bg-[#61587C] p-2 gap-2 flex flex-col w-full">
                {expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Expenses_Card;