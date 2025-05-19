"use client"

import { Card_Group } from '../../Cards/CardGroup/GroupCard'
import { useAuth } from "@/context/AuthContext";
import { useGroup } from "@/context/GroupContext";
import Loader from "@/components/Loader/Loader";

export const GroupsBoard = () => {
  const { user } = useAuth();
  const { memberGroups, adminGroups, loadingGroups } = useGroup();

  if (loadingGroups) {
    return <Loader isLoading={true} message="Cargando tus grupos..." />;
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

export default GroupsBoard;