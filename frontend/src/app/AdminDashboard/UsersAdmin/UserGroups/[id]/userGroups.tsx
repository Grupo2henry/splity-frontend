/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\AdminDashboard\UsersAdmin
"use client"
import { useEffect, useState } from "react";
import { useGroupsAdmin } from "@/services/admin-services.ts/queryGroupsUsers";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
;
export default function GroupsUsersByAdmin({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedStartDate = useDebouncedValue(startDate, 300);
  const debouncedEndDate = useDebouncedValue(endDate, 300);

  const { data, isLoading, error } = useGroupsAdmin(userId, page, debouncedSearch, debouncedStartDate, debouncedEndDate);

  /////
  console.log('Debounced values:', { debouncedSearch, debouncedStartDate, debouncedEndDate})

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
const router = useRouter();
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
      <h1 className="text-2xl text-white font-bold mb-4">Grupos del usuario</h1>
      <div className="flex flex-col gap-4 w-full  mb-4 mx-auto">
        <input
          type="text"
          placeholder="Busca por nombre"
          value={search}
          onChange={handleSearchChange}
          className="border custom-input !w-full rounded-lg"
        />
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
  data.data.map((group: any) => (
    <li key={group.id} className="border-b py-2 mx-auto p-4">
      <Link href={`/AdminDashboard/UsersAdmin/GroupsAdmin/${group.id}`} className="text-[#F59E0B] hover:underline">
        {group.name}
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
          className="px-3 py-1 bg-green-900 text-white rounded  hover:-translate-y-1 transition duration-300"
          >
              Volver
          </button>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
           className={`px-3 py-1 rounded hover:-translate-y-1 transition duration-300 ${
            page === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-400"
          }`}
        >
          Anterior
        </button>
        <span>Página {data.page} de {data.lastPage == 0 ? 1 : data.lastPage}</span>
        <button
          onClick={() => setPage((prev) => (prev < data.lastPage ? prev + 1 : prev))}
          disabled={page === data.lastPage}
           className={`px-3 py-1 rounded hover:-translate-y-1 transition duration-300 ${
            page === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-400"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
