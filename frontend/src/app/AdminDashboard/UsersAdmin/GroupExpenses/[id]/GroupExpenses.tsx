/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useRouter } from 'next/navigation';
import { useExpensesOfGroups } from "@/services/admin-services.ts/queryExpensesGroup";
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
;
export default function GroupExpenses({params}: {params: Promise <{id:string}>}){ const { token } = useAuth();
  const resolvedParams = React.use(params);
  const groupId = resolvedParams.id;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sinceAmount, setSinceAmount] = useState("");
  const [untilAmount, setUntilAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedStartDate = useDebouncedValue(startDate, 300);
  const debouncedEndDate = useDebouncedValue(endDate, 300);
  const debouncedSinceAmount = useDebouncedValue(sinceAmount || "", 300);
const debouncedUntilAmount = useDebouncedValue(untilAmount || "", 300);
  const { data, isLoading, error } = useExpensesOfGroups(groupId, page, debouncedSearch, debouncedStartDate, debouncedEndDate, debouncedSinceAmount, debouncedUntilAmount,);

  /////
  console.log('Debounced values:', { debouncedSearch, debouncedStartDate, debouncedEndDate, debouncedSinceAmount, debouncedUntilAmount })
   const handleSearchChangeUntilAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUntilAmount(e.target.value);
    setPage(1);
  };
   const handleSearchChangeSinceAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinceAmount(e.target.value);
    setPage(1);
  };
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

 const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value && !isNaN(new Date(value).getTime())) {
    if (endDate && new Date(value) > new Date(endDate)) {
      alert('La fecha inicial no puede ser posterior a la fecha final');
      return;
    }
    setStartDate(value);
    setPage(1);
  }
};
console.log("gastos", data)
 const handleResetFilters = () => {
  setSearch("");
  setStartDate("");
  setEndDate("");
  setSinceAmount("");
  setUntilAmount("");
  setPage(1);
};
 const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value && !isNaN(new Date(value).getTime())) {
    if (startDate && new Date(value) < new Date(startDate)) {
      alert('La fecha final no puede ser anterior a la fecha inicial');
      return;
    }
    setEndDate(value);
    setPage(1);
  }
};
  const router = useRouter();

  if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-">
      <div className="animate-spin rounded-full h-15 w-15 border-t-2 border-b-2 border-blue-500 block mb-2.5 "></div>
      <p>Cargando...</p>
    </div>
  );
}
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;
  if (!data) return <p className="text-center">No se encontraron datos</p>;
  return (<div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
      <h1 className="text-2xl text-white font-bold mb-4">Gastos del grupo</h1>
      <div className="grid grid-cols-2  gap-4 mb-4 w-full">
        <div className="col-span-1">
        <input
          type="text"
          placeholder="Busca por descripción"
          value={search}
          onChange={handleSearchChange}
          className="border custom-input !w-full rounded-lg"
        />
        </div>
        <div className="col-span-1 flex gap-4">
        <div className="w-1/2">
          <input
          type="number"
          placeholder="Desde $:"
          value={sinceAmount}
          onChange={handleSearchChangeSinceAmount}
          className="border custom-input rounded-lg"
          min="0"
        /></div>
        <div className="w-1/2">
         <input
          type="number"
          placeholder="Hasta $:"
          value={untilAmount}
          onChange={handleSearchChangeUntilAmount}
          className="border custom-input rounded-lg"
          min="0"
        /></div>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            placeholder="Fecha inicial"
            value={startDate}
            onChange={handleStartDateChange}
            className="border custom-input !w-1/2 rounded-lg"
          />
          <input
            type="date"
            placeholder="Fecha final"
            value={endDate}
            onChange={handleEndDateChange}
            className="border custom-input !w-1/2 rounded-lg"
          />
        </div>
      </div>
      <ul className="mb-4 w-full my-0">
       {data.data.length > 0 ? (
  data.data.map((expense: any) => (
    <li key={expense.id} className="border-b py-2 mx-auto p-4 ">
      <div className="text-[#F59E0B]">
        {expense.name}- valor: ${expense.amount} fecha: {expense.createdAt}hs - gasto: {expense.active ? "activo": "desactivado" }
      </div>
    </li>

  ))
) : (
  <p className="text-center">No se encontraron gastos</p>
)}
      </ul>

      <div className="flex gap-12">
        <button
          onClick={router.back}
          className="px-3 py-1 bg-green-900 text-white rounded"
          >
              Volver
          </button>
          <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-600 rounded"
          >
           Anterior
          </button>
        <span>Página {data.page} de {data.lastPage}</span>
        <button
          onClick={() => setPage((prev) => (prev < data.lastPage ? prev + 1 : prev))}
          disabled={page === data.lastPage}
          className="px-3 py-1 bg-gray-600 rounded"
        >
          Siguiente
        </button>
        <button
          onClick={handleResetFilters}
          className="px-3 py-1 bg-blue-700 text-white rounded"
          >
           Resetear Filtros
         </button>
      </div>
    </div>
  ); }