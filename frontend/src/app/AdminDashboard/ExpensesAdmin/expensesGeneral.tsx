
// src\app\AdminDashboard\UsersAdmin
// src\app\AdminDashboard\UsersAdmin\GroupsGeneralAdmin.tsx
"use client";
import {useEffect, useState } from "react";
import { useExpensesGeneral } from "@/services/admin-services.ts/queryExpensesGeneral";
import Link from "next/link";
import { useRouter } from 'next/navigation';
interface Group {
  id: number;
  name: string;
  active: boolean;
}
interface PaidBy {
  name: string;
}
interface Expense {
  id: number;
  description: string;
  amount: number;
  created_at: string; // ISO 8601 date string
  date: string; // ISO 8601 date string
  imgUrl: string;
  active: boolean;
  group: Group 
  paid_by: PaidBy;
}

const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function ExpensesGeneralAdmin() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sinceAmount, setSinceAmount] = useState("");
    const [untilAmount, setUntilAmount] = useState("");
  const [active, setActive] = useState<string>("");
  

  const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedStartDate = useDebouncedValue(startDate, 300);
  const debouncedEndDate = useDebouncedValue(endDate, 300);
 const debouncedSinceAmount = useDebouncedValue(sinceAmount || "", 300);
const debouncedUntilAmount = useDebouncedValue(untilAmount || "", 300);
  const { data, isLoading, error } = useExpensesGeneral(
    page,
    debouncedSearch,
    debouncedStartDate,
    debouncedEndDate,
    debouncedSinceAmount,
    debouncedUntilAmount,
    active
  );
  console.log("Data recibida:", data);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
   const handleSearchChangeUntilAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUntilAmount(e.target.value);
    setPage(1);
  };
   const handleSearchChangeSinceAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSinceAmount(e.target.value);
    setPage(1);
  };


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !isNaN(new Date(value).getTime())) {
      if (endDate && new Date(value) > new Date(endDate)) {
        alert("La fecha inicial no puede ser posterior a la fecha final");
        return;
      }
      setStartDate(value);
      setPage(1);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !isNaN(new Date(value).getTime())) {
      if (startDate && new Date(value) < new Date(startDate)) {
        alert("La fecha final no puede ser anterior a la fecha inicial");
        return;
      }
      setEndDate(value);
      setPage(1);
    }
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActive(e.target.value);
    setPage(1);
  };
  const handleResetFilters = () => {
  setSearch("");
  setStartDate("");
  setEndDate("");
  setSinceAmount("");
  setUntilAmount("");
  setActive("");
  setPage(1);
};
const router = useRouter();
console.log("gastos", data)

  if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-">
      <div className="animate-spin rounded-full h-15 w-15 border-t-2 border-b-2 border-blue-500 block mb-2.5 "></div>
      <p>Cargando...</p>
    </div>
  );
}
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;
  if (!data?.data) return <p className="text-center">No se encontraron datos</p>;

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
      <h1 className="text-2xl text-white font-bold mb-4">Gastos</h1>
      <div className="grid grid-cols-2  gap-4 mb-4 w-full">
        <div className="col-span-1">
        <input
          type="text"
          placeholder="Busca por nombre"
          value={search}
          onChange={handleSearchChange}
          className="border custom-input col-span-1 rounded-lg"
        /></div>
        <div className="col-span-1 flex gap-1">
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

        <div className="flex gap-1">
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


        <select
          value={active}
          onChange={handleActiveChange}
          className="border custom-input !w-full rounded-lg"
        >
          <option value="">Todos</option>
          <option value="true">De grupos activos</option>
          <option value="false">De grupos desactivados</option>
        </select>


      </div>
      <ul className="mb-4 w-full my-0">
        {data.data.length > 0 ? (
          data.data.map((expense: Expense) => (
            <li key={expense.id} className="border-b py-2 mx-auto p-4">
              <Link
                href={`/AdminDashboard/UsersAdmin/GroupsAdmin/${expense.group.id}`}
                className="text-[#F59E0B] hover:underline"
              >
                {expense.description} {expense.group ? (expense.group.active ? "(Grupo activo)" : "(Grupo desactivado)") : "(Sin grupo)"} - valor: ${expense.amount} fecha: {new Date(expense.created_at).toLocaleString('es-AR',{ dateStyle:'short', timeStyle: 'short'})} - gasto: {expense.active ? "activo": "desactivado"} - pagado por: {expense.paid_by.name}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-center">No se encontraron grupos</p>
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
  );
}