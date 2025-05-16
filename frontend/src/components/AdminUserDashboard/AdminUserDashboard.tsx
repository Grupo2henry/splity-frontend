
/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\AdminDashboard\UsersAdmin
"use client"
import { useEffect, useState } from "react";
import { useUsers } from "@/services/queryUsers";
import Link from "next/link";
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
export default function AdminUserButton() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isLoading, error } = useUsers(page, debouncedSearch);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  if (isLoading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;
  if (!data) return <p className="text-center">No se encontraron datos</p>;
  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
      <h1 className="text-2xl text-white font-bold mb-4">Usuarios</h1>
      <input type="text" placeholder="Busca por nombre" value={search} onChange={handleSearchChange} className="border custom-input !w-90 rounded-lg self-start mb-4 mx-auto"/>
      <ul className="mb-4 w-full my-0">
        {data.data.map((user: any) => (
          <li key={user.id} className="border-b py-2 mx-auto p-4"> <Link href={`/AdminDashboard/UsersAdmin/${user.id}`} className="text-[#F59E0B] hover:underline">
            {user.name} - {user.email}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex gap-12">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1  bg-gray-200 rounded"
        >
          Anterior
        </button>

        <span>Página {data.page} de {data.lastPage}</span>

        <button
          onClick={() => setPage((prev) => (prev < data.lastPage ? prev + 1 : prev))}
          disabled={page === data.lastPage}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
