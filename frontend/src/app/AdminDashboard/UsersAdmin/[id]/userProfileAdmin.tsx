/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { handleDeletePhoto, handleActivateUser, handleDesactivateUser } from "@/services/handlerUserAdmin/handlersUser";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/services/handlerUserAdmin/userInterface";
const DEFAULT_PROFILE_IMAGE = "/favicon.svg";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users`;

async function fetchUser (userId : string){ const token = localStorage.getItem("token") || "";
const res = await  fetch(`${API_URL}/${userId}`, {headers:{ Authorization : `Bearer ${token}`}})
if(!res.ok){ throw new Error("Error al obtener usuario")}
return res.json()
}
export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;
  const router = useRouter();

const {data: user, isLoading, error, refetch} = useQuery<User, Error>({queryKey: ["user", userId], queryFn: ()=> fetchUser(userId)})

if (isLoading) return <p className="text-center mt-2.5"></p>





  return (<div className="flex flex-col w-full items-center mx-auto m-10 min-h-min">
    <h1 className="text-2xl font-bold mb-4 text-white">{user.name}</h1>
  
    <div className="grid grid-cols-2 gap-6 mb-6 w-full max-w-lg">
      <div className="flex justify-center">
        <Image
          src={user.profile_picture_url ?? DEFAULT_PROFILE_IMAGE}
          alt="Imagen de perfil"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
  

      <div className="flex flex-col gap-3">
        <button 
        onClick={() => handleDeletePhoto(userId, setUser, setError, setRefreshTrigger)}
          className="px-4 py-2 bg-[#BE3C25] text-white rounded hover:bg-red-700">
          Eliminar Foto
        </button>
        <button
          onClick={() => handleActivateUser(userId, setUser, setError, setRefreshTrigger)}
          disabled={user.active}
          className={`px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 ${
            user.active ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Activar Usuario
        </button>
        <button
          onClick={() => handleDesactivateUser(userId, setUser, setError, setRefreshTrigger)}
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
        className="mt-6 px-3 py-1 bg-gray-200 rounded col-span-1"
      >
        Volver
      </button>
      <button
        onClick={() => router.back()}
        className="mt-6 px-3 py-1 bg-gray-200 rounded col-span-2"
      >
        Grupos de usuario
      </button>
    </div>
  </div>
  );
}