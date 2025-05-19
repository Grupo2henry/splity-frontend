/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useGroupDetails } from "@/services/admin-services.ts/groupsDetailsHook";
import { useRouter } from "next/navigation";
import { handleGroupDeactivate, handleGroupActivate } from "@/services/handlerUserAdmin/handlerGroup";
import Link from "next/link";
import { useAuth } from "@/services/authContext/authContext";

export default function GroupsDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const groupId = resolvedParams.id;
  const { data, isLoading, error } = useGroupDetails(groupId);
  const { token } = useAuth();
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

  if (!token) {
    return <p className="text-red-500 text-center">Por favor, inicia sesión para continuar.</p>;
  }
  if (isLoading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;
  if (!data) {
    console.log("No data received:", data);
    return <p className="text-center">No se encontraron datos</p>;
  }

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min text-white">
      {alert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {alert.message}
        </div>
      )}
      <h1 className="text-2xl text-white font-bold mb-4">Detalles del Grupo</h1>
      <div className="items-center">
        <p><strong>Nombre:</strong> {data.name}</p>
        <p><strong>Fecha de creación:</strong> {new Date(data.created_at).toLocaleDateString()}</p>
        <p><strong>Creado por:</strong> {data.created_by.name} -- {data.created_by.email}</p>
      </div>
      <div className="space-x-2 mb-0 mt-4 text-white">
        <button className="bg-gradient-to-r from-[#433a5e] to-[#61587C] p-2 rounded-sm hover:shadow-sm hover:bg-[#746995] hover:-translate-y-1 transition duration-300">
          <Link href={`/AdminDashboard/UsersAdmin/UserGroupsMembers/${data.id}`}>
            Miembros: {data.membershipCount}
          </Link>
        </button>
        <button className="bg-gradient-to-r from-[#433a5e] to-[#61587C] p-2 rounded-sm hover:shadow-sm hover:bg-[#746995] hover:-translate-y-1 transition duration-300">
          <Link href={`/AdminDashboard/UsersAdmin/GroupExpenses/${data.id}`}>
            Gastos: {data.expenseCount}
          </Link>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-lg">
        <button
          onClick={() => router.back()}
          className="mt-6 px-3 py-1 bg-gray-600 rounded col-span-1 hover:-translate-y-1 transition duration-300"
        >
          Volver
        </button>
        <button
          onClick={() => deactivateMutation.mutate({ groupId, token })}
          className={`mt-6 px-3 py-1 bg-red-950 rounded col-span-1 hover:-translate-y-1 transition duration-300 ${
            data.active ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!data.active}
        >
          Desactivar
        </button>
        <button
          onClick={() => activateMutation.mutate({ groupId, token })}
          className={`mt-6 px-3 py-1 bg-green-900 rounded col-span-1 hover:-translate-y-1 transition duration-300 ${
            !data.active ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={data.active}
        >
          Activar grupo
        </button>
      </div>
    </div>
  );
}