
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useGroupDetails } from "@/services/admin-services.ts/groupsDetailsHook";
import { useRouter } from "next/navigation";
import { handleGroupDeactivate, handleGroupActivate } from "@/services/handlerUserAdmin/handlerGroup";
import Link from "next/link";
import { useMembersAdmin } from "@/services/admin-services.ts/queryMembers";
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


export default function GroupsDetails({ params }: { params: Promise<{ id: string }> }) {
  // const {token} = useAuth()
  const resolvedParams = React.use(params);
  const token = localStorage.getItem("token");
  const groupId = resolvedParams.id;
   const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGroupDetails(groupId, token );
  const {
  data: detailData,
  isLoading: detailIsLoading,
  error: detailError, refetch
  } = useMembersAdmin(groupId, page, token);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const deactivateMutation = useMutation({
    mutationFn: ({ groupId, token }: { groupId: string; token: string }) =>
      handleGroupDeactivate(groupId, token),
    onMutate: async ({ groupId }) => {
      await queryClient.cancelQueries({ queryKey: ["detailsOfGroup", groupId] });
      const previousData = queryClient.getQueryData(["detailsOfGroup", groupId]);
      queryClient.setQueryData(["detailsOfGroup", groupId], (old: any) => ({
        ...old,
        active: false,
      }));
      return { previousData };
    },
    onError: (err: any, { groupId }, context) => {
      queryClient.setQueryData(["detailsOfGroup", groupId], context?.previousData);
      showAlert("error", err.message || "Error al desactivar el grupo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detailsOfGroup", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      showAlert("success", "Grupo desactivado con éxito");
    },
  });

  const activateMutation = useMutation({
    mutationFn: ({ groupId, token }: { groupId: string; token: string }) =>
      handleGroupActivate(groupId, token),
    onMutate: async ({ groupId }) => {
      await queryClient.cancelQueries({ queryKey: ["detailsOfGroup", groupId] });
      const previousData = queryClient.getQueryData(["detailsOfGroup", groupId]);
      queryClient.setQueryData(["detailsOfGroup", groupId], (old: any) => ({
        ...old,
        active: true,
      }));
      return { previousData };
    },
    onError: (err: any, { groupId }, context) => {
      queryClient.setQueryData(["detailsOfGroup", groupId], context?.previousData);
      showAlert("error", err.message || "Error al activar el grupo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detailsOfGroup", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      showAlert("success", "Grupo activado con éxito");
    },
  });

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
      refetch()
      showAlert("success", `Usuario ${result.newStatus ? "activado" : "desactivado"} con éxito`);
      
    } catch (err) {
      console.error("Error en toggleUserStatus:", err);
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      showAlert("error", errorMessage);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  if (!token) {
    return <p className="text-red-500 text-center">Por favor, inicia sesión para continuar.</p>;
  }
  if (isLoading || detailIsLoading) return <p className="text-center">Cargando...</p>;
  if (error || detailError ) return <p className="text-red-500 text-center">Error en obtener datos</p>;
  if (!data || !detailData) {
    console.log("No data received:", data, detailData);
    return <p className="text-center">No se encontraron datos</p>;
  }

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min text-white">
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 border p-4 rounded-md shadow-lg ${
      alert.type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}
        >
          {alert.message}
        </div>
      )}
      <h1 className="text-2xl text-white font-bold mb-4">Detalles del Grupo</h1>
     <div className="grid grid-cols-2 gap-6 mb-6 w-full">
  {/* Columna izquierda: Textos */}
  <div className="flex flex-col gap-4">
    <p className="text-white">
      <strong>Nombre:</strong> {data.name}
    </p>
    <p className="text-white">
      <strong>Fecha de creación:</strong> {new Date(data.created_at).toLocaleDateString()}
    </p>
    <p className="text-white">
      <strong>Creado por:</strong> {data.created_by.name} -- {data.created_by.email}
    </p>
  </div>

  {/* Columna derecha: Botones */}
  <div className="flex flex-col gap-4">
    <button className="w-full bg-gradient-to-r from-[#433a5e] to-[#61587C] text-white py-2 rounded-md hover:shadow-md hover:bg-[#746995] hover:-translate-y-0.5 transition duration-300">
      <Link href={`/AdminDashboard/UsersAdmin/GroupExpenses/${data.id}`} className="block">
        Gastos: {data.expenseCount}
      </Link>
    </button>
    <button
      onClick={() => deactivateMutation.mutate({ groupId, token })}
      className={`w-full bg-red-950 text-white py-2 rounded-md hover:-translate-y-0.5 transition duration-300 ${
        data.active ? "hover:bg-red-800" : "opacity-50 cursor-not-allowed"
      }`}
      disabled={!data.active}
    >
      Desactivar
    </button>
    <button
      onClick={() => activateMutation.mutate({ groupId, token })}
      className={`w-full bg-green-900 text-white py-2 rounded-md hover:-translate-y-0.5 transition duration-300 ${
        !data.active ? "hover:bg-green-800" : "opacity-50 cursor-not-allowed"
      }`}
      disabled={data.active}
    >
      Activar grupo
    </button>
  </div>
</div>
      <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min text-white">
      <h1 className="text-2xl font-bold mb-4">Usuarios del Grupo:  {data.membershipCount}</h1>
      {detailData.data.length === 0 ? (
        <p className="text-center">No hay miembros en este grupo</p>
      ) : (
        <ul className="mb-4 w-full my-0">
          {detailData.data.map((user: Member) => (
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
          onClick={() => router.back()}
          className="px-3 py-1 bg-gray-600 rounded hover:-translate-y-1 transition duration-300"
        >
          Volver
        </button>
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
        <span>Página {detailData.page} de {detailData.lastPage}</span>
        <button
          onClick={() => setPage((prev) => (prev < detailData.lastPage ? prev + 1 : prev))}
          disabled={page === detailData.lastPage}
          className={`px-3 py-1 rounded ${
            page === detailData.lastPage
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-400"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
    </div>
  );
}