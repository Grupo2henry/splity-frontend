
"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    quantity: number;
    active: boolean;
    profile_picture_url: string;
    is_premium: boolean;
  }
// `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`
export function UserProfile({params} : {params: Promise<{ id: string }>}){ 
  const defaultimg = "/favicon.svg";
  const resolvedParams = React.use(params); // Desempaqueta params usando React.use
  const userId = resolvedParams.id;
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
   useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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
  if(loading){return <p className="text-center">Cargando perfil...</p>}
  if(error){ return <p className="text-red-500 text-center">Error: {error}</p>}
  if(!user){ return <p className="text-center">Usuario no encontrado</p>}
  return(<div className="card p-4">
    <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
    <Image src={user.profile_picture_url ?? defaultimg} alt="img profile" width={100}
  height={100}></Image>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Creado:</strong> {new Date(user.created_at).toLocaleString()}</p>
    <p><strong>Grupos:</strong> {user.quantity}</p>
    <p><strong>Estado:</strong> {user.active ? "Activo.": "Inactivo."}</p>
    <p><strong>Premium:</strong> {user.is_premium ? "Sí.": "No."}</p>
    <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        Volver
      </button>
  </div>)
    
}
export default UserProfile