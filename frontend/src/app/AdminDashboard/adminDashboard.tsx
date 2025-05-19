"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader/Loader"; // Importa el Loader si no lo tienes ya

const AdminDashboard = () => {
  const { user, userValidated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userValidated) {
      if (!user) {
        router.push("/Login");
      } else if (user.role !== 'admin') {
        router.push("/Dashboard");
      }
    }
  }, [user, userValidated, loading, router]);

  if (loading) {
    return <Loader isLoading={true} message="Verificando permisos de administrador..." />;
  }

  // Si no está validado aún, no renderizamos nada para evitar flashes
  if (!userValidated) {
    return null;
  }

  // Si el usuario existe y es administrador, renderizamos el contenido del dashboard de administrador
  if (user && user.role === 'admin') {
    return (
      <div className="divDashboard flex flex-col w-full min-h-screen items-center mx-auto pt-4 m-14">
        {/* Botón Usuarios */}
        <Link href={"AdminDashboard/UsersAdmin"} className="card">
          <button className="mx-auto">
            <h2 className="mx-auto my-auto text-gray-100 drop-shadow-md text-2xl font-semibold tracking-wide">Usuarios</h2>
          </button>
        </Link>
        {/* Botón Grupos */}
         <Link href={"AdminDashboard/GroupsAdmin"} className="card">
        <button className="mx-auto">
          <h2 className="mx-auto my-auto text-white text-2xl font-semibold tracking-wide">Grupos</h2>
        </button>
        </Link>

        {/* Botón Gastos */}
        <Link href={"AdminDashboard/ExpensesAdmin"} className="card">
        <button className="mx-auto">
          <h2 className="mx-auto my-auto text-white text-2xl font-semibold tracking-wide">Gastos</h2>
        </button>
        </Link>
      </div>
    );
  }

  // Si el usuario no es administrador (pero está logueado, ya se manejó en el useEffect), no renderizamos nada aquí.
  // El useEffect ya lo redirigió a /Dashboard.
  return null;
};

export default AdminDashboard;