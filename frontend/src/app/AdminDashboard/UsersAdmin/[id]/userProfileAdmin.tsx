/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { handleDeletePhoto, handleActivateUser, handleDesactivateUser } from "@/services/handlerUserAdmin/handlersUser";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/services/handlerUserAdmin/userInterface";
const DEFAULT_PROFILE_IMAGE = "/favicon.svg";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

async function fetchUser(userId: string, token: string | null) {
  console.log("el token es", token)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) { throw new Error("Error al obtener usuario"); }
  return res.json();
}

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const {token} = useAuth()
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
  const router = useRouter();
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string,  position?: 'top-right' | 'bottom-center'; } | null>(null);
  

  const { data: user, isLoading, error, refetch } = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId, token)
  });

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };
  const handlePhotoDelete = async () => {
    const response = await handleDeletePhoto(userId, token, refetch);
     showAlert(response.success ? "success"  : "error", response.message,);
  };

  const handleUserActivation = async () => {
    const response = await handleActivateUser(userId, token, refetch);
    showAlert(response.success ? "success"  : "error", response.message,);
  };

  const handleUserDeactivation = async () => {
    const response = await handleDesactivateUser(userId, token, refetch);
     showAlert(response.success ? "success"  : "error", response.message,);
  };

  if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen pt-">
      <div className="animate-spin rounded-full h-15 w-15 border-t-2 border-b-2 border-blue-500 block mb-2.5 "></div>
      <p>Cargando...</p>
    </div>
  );
}
  if (error) return <p className="text-red-500 text-center mt-2">Error: {error.message}</p>;
  if (!user) return <p className="text-center mt-2">Usuario no encontrado</p>;

  return (
    <div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
      {/* Alertas */}
      {alert && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
          alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {alert.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-white">{user.name}</h1>

      <div className="grid grid-cols-2 gap-6 mb-6 w-full max-w-lg">
       <div className="relative w-24 h-24 rounded-full overflow-hidden ml-10 mt-5">
  {user.profile_picture_url ? (
  <Image
    src={user.profile_picture_url}
    alt="Imagen de perfil"
    fill
    className="object-cover"
  />
) : <Image
    src={DEFAULT_PROFILE_IMAGE}
    alt="Imagen de perfil"
    fill
    className="object-cover"
  />}
  
</div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePhotoDelete}
           disabled={!user.profile_picture_url}
    className={`px-4 py-2 rounded text-white transition ${
      user.profile_picture_url
        ? "bg-[#BE3C25] hover:bg-red-700"
        : "bg-gray-400 cursor-not-allowed"
    }`}
          >
            Eliminar Foto
          </button>
          <button
            onClick={handleUserActivation}
            disabled={user.active}
            className={`px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 ${
              user.active ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Activar Usuario
          </button>
          <button
            onClick={handleUserDeactivation}
            disabled={!user.active}
            className={`px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 ${
              !user.active ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Desactivar Usuario
          </button>
        </div>
      </div>

      <div className="space-y-1 text-white w-full max-w-lg">
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

      <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
        <button
          onClick={() => router.back()}
          className="mt-6 px-3 py-1 bg-green-900 rounded col-span-1 hover:-translate-y-1 transition duration-300"
        >
          Volver
        </button>
        
        <button
          className="mt-6 px-3 py-1 bg-gray-600 rounded col-span-2 hover:-translate-y-1 transition duration-300"
        >
          <Link href={`/AdminDashboard/UsersAdmin/UserGroups/${userId}`}>
           Grupos de usuario
            </Link>
        </button>
      </div>
    </div>
  );
}