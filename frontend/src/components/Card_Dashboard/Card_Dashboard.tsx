"use client"

import { Card_Group } from './../Card_Group/Card_Group'
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useGroup } from "@/context/GroupContext";
import Loader from "@/components/Loader/Loader"; // Importa el Loader

export const Card_Dashboard = () => {
  const { user, loading, userValidated } = useAuth();
  const router = useRouter();
  const { memberGroups, adminGroups, loadingGroups } = useGroup();

  console.log("Este es el user en Card_Dashboard: ", user, "Loading:", loading, "UserValidated:", userValidated);
  console.log("Grupos miembro:", memberGroups);
  console.log("Grupos admin:", adminGroups);
  console.log("Nombre de usuario: ", user?.name);

  useEffect(() => {
    if (!userValidated && !loading) {
      router.push("/Login");
      return;
    }
  }, [userValidated, loading, router]);

  // Mostrar el Loader mientras se cargan los grupos
  if (loadingGroups) {
    return <Loader isLoading={true} message="Cargando tus grupos..." />;
  }

  if (!userValidated && !loading) {
    return <div>Redirigiendo a Login...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      <h3 className="text-lg font-semibold mb-4 text-white">Grupos Creados por Mí:</h3>
      {adminGroups.map((group) => (
        <Card_Group
          key={group.id}
          group={group}
          subtitleText="miembros"
          bgColor="bg-[#388E3C]"
          subtitleColor="text-[#A5D6A7]"
        />
      ))}

      <h3 className="text-lg font-semibold mt-8 mb-4 text-white">Mis Grupos:</h3>
      {memberGroups.map((group) => (
        <Card_Group
          key={group.id}
          group={group}
          subtitleText="amigos"
          bgColor="bg-[#61587C]"
          subtitleColor="text-[#FFCD82]"
        />
      ))}
    </div>
  );
};

export default Card_Dashboard;