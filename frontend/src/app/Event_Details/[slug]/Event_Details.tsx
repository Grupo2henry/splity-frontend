"use client";

import Image from "next/image";
import { NavBar_Event_Details } from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import Expenses_Card from "@/components/Expenses_Card/Expenses_Card";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useGroup } from "@/context/GroupContext";

export const Event_Details = () => {
  const [state, setState] = useState("Gastos");
  const { slug } = useParams();
  const { actualGroup, fetchGroupById, loadingGroups } = useGroup();
  const slugNumber = Number(Array.isArray(slug) ? slug[0] : slug); // Asegúrate de que slug sea un string

  useEffect(() => {
    if (slug) {
      fetchGroupById(Array.isArray(slug) ? slug[0] : slug); // Pasa el primer elemento si es un array, o el string si no lo es
    }
  }, [slug, fetchGroupById]);

  if (loadingGroups || !actualGroup) {
    return <div>Cargando detalles del evento...</div>; // O un spinner
  }

  return (
    <div className="flex flex-col w-full h-full items-center">
      <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />
      <div className="flex flex-col w-full h-full items-center mb-6 gap-2">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#61587C] text-5xl">
          {actualGroup.emoji || "📁"}
        </div>
        <p className="text-[16px] text-[#FFFFFF] text-center">{actualGroup.name}</p>
      </div>
      <div className="flex w-full h-full rounded-lg bg-[#61587C] gap-2 p-2 items-center justify-between mb-6">
        {["Gastos", "Saldos", "Comprobantes"].map((item) => (
          <div key={item} className="flex w-1/3">
            <button
              className={state === item ? "custom-input text-gray-700 font-bold" : "custom-input text-gray-400 font-bold"}
              onClick={() => setState(item)}
            >
              {item}
            </button>
          </div>
        ))}
      </div>
      {state === "Gastos" && <Expenses_Card slugNumber={slugNumber} />}
      <NavBar_Event_Details slugNumber={slugNumber} />
    </div>
  );
};

export default Event_Details;
