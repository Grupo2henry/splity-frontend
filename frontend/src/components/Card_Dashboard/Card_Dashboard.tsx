"use client"

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useGroup } from "@/context/GroupContext";

export const Card_Dashboard = () => {
  const { user, loading, userValidated } = useAuth();
  const router = useRouter();
  const { memberGroups, adminGroups, loadingGroups } = useGroup();

  console.log("Este es el user en Card_Dashboard: ", user, "Loading:", loading, "UserValidated:", userValidated);
  console.log("Grupos miembro:", memberGroups);
  console.log("Grupos admin:", adminGroups);

  useEffect(() => {
    if (!userValidated && !loading) {
      router.push("/Login");
      return;
    }
  }, [userValidated, loading, router]);

  if (!userValidated && loadingGroups) {
    return <div>Cargando grupos...</div>; // O un spinner específico para grupos
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
        <Link key={group.id} href="/Event_Details">
          <div className="flex w-full bg-[#388E3C] p-2 rounded-lg mb-6">
            <div className="text-5xl">
              {group.emoji || "📁"}
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col justify-start items-start ml-2">
                <h2 className="text-[#FFFFFF]">{group.name}</h2>
                {group.cantidad !== undefined && (
                  <p className="text-[#A5D6A7]">{group.cantidad} miembros</p>
                )}
              </div>
              <button>{'\u27A4'}</button>
            </div>
          </div>
        </Link>
      ))}

      <h3 className="text-lg font-semibold mt-8 mb-4 text-white">Mis Grupos:</h3>
      {memberGroups.map((group) => (
        <Link key={group.id} href="/Event_Details">
          <div className="flex w-full bg-[#61587C] p-2 rounded-lg mb-6">
            <div className="text-5xl">
              {group.emoji || "📁"}
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col justify-start items-start ml-2">
                <h2 className="text-[#FFFFFF]">{group.name}</h2>
                {group.cantidad !== undefined && (
                  <p className="text-[#FFCD82]">{group.cantidad} amigos</p>
                )}
              </div>
              <button>{'\u27A4'}</button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Card_Dashboard;