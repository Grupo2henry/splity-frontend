/* eslint-disable @typescript-eslint/no-unused-vars */
// app/user/[slug]/page.tsx

import { headers } from "next/headers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string; // Ajusta según los campos de tu entidad
  }
// `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`
export function UserProfile({params} : {params : { id: string}}){ 
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
   useEffect(() => {
    const fetchUser = async () => {
      try {
        // Extrae el ID del slug (formato: "id-nombre")
        const userId = params.id;
        const token = localStorage.getItem("token") || "";

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
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
  }, [params.id]);
  if(loading){return <p className="text-center">Cargando perfil...</p>}
  if(error){ return <p className="text-red-500 text-center">Error: {error}</p>}
  if(!user){ return <p className="text-center">Usuario no encontrado</p>}
  return(<div className="p-4">
    <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
    <p><strong>Email:</strong> {user.email}</p>
    <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        Volver
      </button>
  </div>)
    
}