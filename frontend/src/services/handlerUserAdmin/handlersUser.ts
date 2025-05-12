/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/handlers/userHandlers.ts
// Definición de tipos
import { User } from "./userInterface";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export const handleDeletePhoto = async (
  userId: string,
  refetch: () => void
) => {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/${userId}/profile-picture`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar la foto de perfil");
  refetch();
};

export const handleActivateUser = async (
  userId: string,
  refetch: () => void
) => {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/${userId}/activate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active: true }),
  });
  if (!res.ok) throw new Error("Error al activar el usuario");
  refetch();
};

export const handleDesactivateUser = async (
  userId: string,
  refetch: () => void
) => {
  const token = localStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/${userId}/deactivate`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active: false }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error("Error al desactivar el usuario");
  }
  refetch();
};
