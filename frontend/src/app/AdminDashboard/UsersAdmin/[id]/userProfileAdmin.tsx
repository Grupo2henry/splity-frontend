"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

// Definición de tipos
interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  quantity: number;
  active: boolean;
  profile_picture_url: string | null;
  is_premium: boolean;
}

// Constantes
const DEFAULT_PROFILE_IMAGE = "/favicon.svg";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Efecto para cargar el usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch(`${API_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener el usuario");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Funciones para manejar acciones de los botones
  const handleDeletePhoto = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/${userId}/profile-picture`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar la foto de perfil");
      setUser((prev) => prev ? { ...prev, profile_picture_url: null } : null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleActivateUser = async () => {
    try {
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
      setUser((prev) => prev ? { ...prev, active: true } : null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeactivateUser = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/${userId}/deactivate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });

      if (!res.ok) throw new Error("Error al desactivar el usuario");
      setUser((prev) => prev ? { ...prev, active: false } : null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Renderizado condicional
  if (loading) return <p className="text-center">Cargando perfil...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!user) return <p className="text-center">Usuario no encontrado</p>;

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">{user.name}</h1>

      {/* Sección de imagen y botones en dos columnas */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Columna de la imagen */}
        <div className="flex justify-center">
          <Image
            src={user.profile_picture_url ?? DEFAULT_PROFILE_IMAGE}
            alt="Imagen de perfil"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* Columna de los botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDeletePhoto}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar Foto
          </button>
          <button
            onClick={handleActivateUser}
            disabled={user.active}
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              user.active ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Activar Usuario
          </button>
          <button
            onClick={handleDeactivateUser}
            disabled={!user.active}
            className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
              !user.active ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Desactivar Usuario
          </button>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="text-center space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Creado:</strong> {new Date(user.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Grupos:</strong> {user.quantity}
        </p>
        <p>
          <strong>Estado:</strong> {user.active ? "Activo" : "Inactivo"}
        </p>
        <p>
          <strong>Premium:</strong> {user.is_premium ? "Sí" : "No"}
        </p>
      </div>

      {/* Botón Volver */}
      <button
        onClick={() => router.back()}
        className="mt-6 px-3 py-1 bg-gray-200 rounded"
      >
        Volver
      </button>
    </div>
  );
}