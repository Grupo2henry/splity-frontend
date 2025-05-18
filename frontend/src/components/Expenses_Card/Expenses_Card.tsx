// src/components/Expenses_Card/Expenses_Cars.tsx
"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate } from "./dateFuntion";
import { useExpenses } from "@/context/ExpensesContext";
import { useAuth } from "@/context/AuthContext";
import { Expense } from "@/context/interfaces/expense.interface";
import Link from 'next/link'; // Importa Link

export const Expenses_Card = () => {
  const { expenses } = useExpenses();
  const { user } = useAuth();
  const [grouped, setGrouped] = useState<Record<string, Expense[]>>({});

  const totalExpenses = expenses?.map((expense) => expense.amount).reduce((a, b) => a + b, 0) || 0;

  const totalPaidByMe = expenses?.filter((expense) => expense.paid_by?.id && user?.id && String(expense.paid_by.id) === user.id)
    .map((expense) => expense.amount)
    .reduce((a, b) => a + b, 0) || 0;

  useEffect(() => {
    const groupedByDate: Record<string, Expense[]> = {};
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
                {expenses.map((expense, index) => (
                  <Link // Envolvemos cada gasto con un Link
                    key={index}
                    href={`/Update_Spent/${expense.id}`}
                    className="flex flex-col w-full"
                  >
                    <div className="flex flex-col w-full px-2 bg-[#d9d9d9] rounded-lg" >
                      <div className="flex flex-row justify-between items-center">
                        <Image src="/image7.svg" alt="Logo" width={25} height={25} />
                        <div className="flex w-full gap-2">
                          <div className="flex flex-col w-full ml-2">
                            <p className="font-bold">{expense.description}</p>
                            <p className="text-sm">Pagado por {expense.paid_by?.name}</p>
                          </div>
                          <p className="font-bold text-md">AR${expense.amount}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
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