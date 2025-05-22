
/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\AdminDashboard\UsersAdmin
"use client"
import { useEffect, useState } from "react";
import { useUsers } from "@/services/admin-services.ts/queryUsers";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
  
};
export default function AdminUserButton() {
   const {token} = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isLoading, error } = useUsers(page, debouncedSearch, token);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
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
  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
      <h1 className="text-2xl text-white font-bold mb-4">Usuarios</h1>
      <input type="text" placeholder="Busca por nombre" value={search} onChange={handleSearchChange} className="border custom-input rounded-lg self-start mb-4 mx-auto"/>
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
          onClick={router.back}
          className="px-3 py-1 bg-green-900 text-white rounded hover:-translate-y-1 transition duration-300"
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
            page === data.lastPage
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
