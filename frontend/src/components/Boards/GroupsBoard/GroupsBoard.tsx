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
      <div className="flex gap-2 mb-6">
          <input className="custom-input" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="¿Que evento quieres buscar?"/>
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSend}>Buscar</button>
          <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={() =>{setFlag(!flag); setInput("")}}><Image src="/eraser.svg" alt="Reset" width={30} height={30}/></button>
      </div>
      <h3 className="text-lg font-semibold mb-4 text-white">Grupos Creados por Mí:</h3>
      {adminGroups?.map((group) => (
        <Card_Group
          key={group.id}
          group={group}
          subtitleText="miembros"
          bgColor="bg-[#388E3C]"
          subtitleColor="text-[#A5D6A7]"
        />
      ))}

      <h3 className="text-lg font-semibold mt-8 mb-4 text-white">Grupos Creados por Mí:</h3>
      {createdGroups?.map((group) => (
          <Link key={group.id} href={`/Event_Details/${group.id}`}>
              <div className="flex w-full bg-[#388E3C] p-2 rounded-lg mb-6">
                  <Image src={"./image1.svg"} alt="Created Group Image" width={77} height={76}/>
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
    </div>
  );
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