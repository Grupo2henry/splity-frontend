// src/components/Expenses_Card/Expenses_Card.tsx
"use client"

import { useEffect, useState } from "react";
import { formatDate } from "./dateFuntion";
import { useExpenses } from "@/context/ExpensesContext";
import { useAuth } from "@/context/AuthContext";
import { Expense } from "@/context/interfaces/expense.interface";
import { ExpenseCard } from "@/components/Cards/ExpenseCard/ExpenseCard";
import styles from "./ExpensesBoard.module.css";

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
    <div className={styles.container}>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryBox}>
          <p className={styles.summaryTitle}>Mis gastos</p>
          <div className={styles.summaryValue}>
            AR$ {totalPaidByMe.toFixed(2)}
          </div>
        </div>
        <div className={styles.summaryBox}>
          <p className={styles.summaryTitle}>Gastos grupales</p>
          <div className={styles.summaryValue}>
            AR$ {totalExpenses.toFixed(2)}
          </div>
        </div>
      </div>

      <div className={styles.expensesList}>
        {Object.entries(grouped).length > 0 ? (
          Object.entries(grouped).map(([date, expenses]) => (
            <div key={date} className={styles.dateGroup}>
              <p className={styles.dateTitle}>{date}</p>
              <div className={styles.expensesGroup}>
                {expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noExpenses}>
            No hay gastos registrados
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses_Card;