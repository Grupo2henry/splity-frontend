/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { User } from "./userInterface";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

interface HandlerResponse {
  success: boolean;
  message: string;
}

export const handleDeletePhoto = async (
  userId: string,
  token: string | null,
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User, Error>>
): Promise<HandlerResponse> => {
  try {
    const res = await fetch(`${API_URL}/${userId}/profile-picture`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error al eliminar la foto de perfil");
    await refetch();
    return { success: true, message: "Foto eliminada" };
  } catch (error) {
    return { success: false, message: "Error al eliminar la foto" };
  }
};

export const handleActivateUser = async (
  userId: string,
  token: string | null,
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User, Error>>
): Promise<HandlerResponse> => {
  try {
    const res = await fetch(`${API_URL}/activate-admin/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: true }),
    });

    if (!res.ok) throw new Error("Error al activar el usuario");
    await refetch();
    return { success: true, message: "Usuario activado" };
  } catch (error) {
    return { success: false, message: "Error al activar el usuario" };
  }
};

export const handleDesactivateUser = async (
  userId: string,
  token: string | null,
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<User, Error>>
): Promise<HandlerResponse> => {
  try {
    const res = await fetch(`${API_URL}/desactivate-admin/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: false }),
    });

    if (!res.ok) throw new Error("Error al desactivar el usuario");
    await refetch();
    return { success: true, message: "Usuario desactivado" };
  } catch (error) {
    return { success: false, message: "Error al desactivar el usuario" };
  }
};
