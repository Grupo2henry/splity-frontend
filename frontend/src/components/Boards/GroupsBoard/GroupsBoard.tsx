"use client"

import { GroupCard } from '../../Cards/GroupCard/GroupCard';
import { useAuth } from "@/context/AuthContext";
import { useGroup } from "@/context/GroupContext";
import Loader from "@/components/Loader/Loader";
import { useState } from "react";

export const GroupsBoard = () => {
  const { user } = useAuth();
  const { memberGroups: initialMemberGroups, adminGroups: initialAdminGroups, loadingGroups } = useGroup();
  const [searchTerm, setSearchTerm] = useState("");

  if (loadingGroups) {
    return <Loader isLoading={true} message="Cargando tus grupos..." />;
  }

  if (!user) {
    return null;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAdminGroups = initialAdminGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMemberGroups = initialMemberGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar grupo por nombre..."
          className="custom-input w-full p-2 border rounded text-black"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && {}} // Puedes agregar aquí lógica de búsqueda si lo deseas
        />
        {/* <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSearch}>Buscar</button> */}
        {searchTerm && (
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => setSearchTerm("")}
          >
            Borrar
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-4 text-white">Grupos Creados por Mí:</h3>
      {filteredAdminGroups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          subtitleText="miembros"
          bgColor="bg-[#388E3C]"
          subtitleColor="text-[#A5D6A7]"
        />
      ))}

      <h3 className="text-lg font-semibold mt-8 mb-4 text-white">Mis Grupos:</h3>
      {filteredMemberGroups.map((group) => (
        <GroupCard
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