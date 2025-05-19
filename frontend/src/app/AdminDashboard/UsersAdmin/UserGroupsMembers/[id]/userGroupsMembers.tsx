
"use client";
<<<<<<< HEAD
import { useMembers } from "@/services/admin-services.ts/queryMembers";
=======
import { useAuth } from "@/context/AuthContext";
import { useMembers } from "@/services/queryMembers";
>>>>>>> 091cf95c4a98629d091a6fbc2ca22ddf6690cb89
import Link from "next/link";
import React, { useState } from "react";

// Interfaz para los datos de usuario
interface Member {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

// Interfaz para la respuesta del backend
interface ToggleStatusResponse {
  success: boolean;
  newStatus: boolean;
  membershipId: number;
}


export default function UserGroupMembers({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const groupId = resolvedParams.id;
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useMembers(groupId, page);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const {token} = useAuth()
  const toggleUserStatus = async (memberId: string) => {
    setLoadingStates((prev) => ({ ...prev, [memberId]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/members/${memberId}/status`,
        {
          method: "PUT",
          headers: {  Authorization: `Bearer ${token}`, },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Membresía no encontrada");
        }
        throw new Error("Error al actualizar el estado");
      }

      const result: ToggleStatusResponse = await response.json();
      if (!result.success || typeof result.newStatus !== "boolean") {
        throw new Error("Respuesta inválida del servidor");
      }

      // Actualizar el caché localmente
      refetch()
      
    } catch (err) {
      console.error("Error en toggleUserStatus:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  if (isLoading) return <p className="text-center text-white">Cargando...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center">Error: {(error as Error).message}</p>
    );
  if (!data || !data.data)
    return <p className="text-center text-white">No se encontraron datos</p>;

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min text-white">
      <h1 className="text-2xl font-bold mb-4">Usuarios del Grupo</h1>
      {data.data.length === 0 ? (
        <p className="text-center">No hay miembros en este grupo</p>
      ) : (
        <ul className="mb-4 w-full my-0">
          {data.data.map((user: Member) => (
            <li
              key={user.id}
              className="border-b py-2 mx-auto p-4 flex justify-between items-center"
            >
              <Link
                href={`/AdminDashboard/UsersAdmin/${user.id}`}
                className="text-[#F59E0B] hover:underline"
              >
                {user.name} - {user.email}
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  disabled={loadingStates[user.id] || user.active}
                  className={`px-2 py-1 rounded text-sm ${
                    user.active || loadingStates[user.id]
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {loadingStates[user.id] ? "Cargando..." : "Activar"}
                </button>
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  disabled={loadingStates[user.id] || !user.active}
                  className={`px-2 py-1 rounded text-sm ${
                    !user.active || loadingStates[user.id]
                      ? "bg-gray-500  cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {loadingStates[user.id] ? "Cargando..." : "Desactivar"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-12 items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-400"
          }`}
        >
          Anterior
        </button>
        <span>Página {data.page} de {data.lastPage}</span>
        <button
          onClick={() => setPage((prev) => (prev < data.lastPage ? prev + 1 : prev))}
          disabled={page === data.lastPage}
          className={`px-3 py-1 rounded ${
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