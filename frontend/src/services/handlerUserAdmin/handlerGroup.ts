/* eslint-disable @typescript-eslint/no-explicit-any */
// @/services/handlerUserAdmin/handlerGroup.ts
// @/services/handlerUserAdmin/handlerGroup.ts
export const handleGroupDeactivate = async (
  groupId: string,
  token: string
): Promise<any> => {
  if (!token) {
    throw new Error("No se proporcionó un token de autenticación");
  }
  const res = await fetch(`http://localhost:4000/group-deactivate/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Token de autenticación inválido o expirado");
    }
    throw new Error(errorData.message || "Error al desactivar el grupo");
  }
  return res.json();
};

export const handleGroupActivate = async (
  groupId: string,
  token: string
): Promise<any> => {
  if (!token) {
    throw new Error("No se proporcionó un token de autenticación");
  }
  const res = await fetch(`http://localhost:4000/group-activate/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error("Token de autenticación inválido o expirado");
    }
    throw new Error(errorData.message || "Error al activar el grupo");
  }
  return res.json();
};
