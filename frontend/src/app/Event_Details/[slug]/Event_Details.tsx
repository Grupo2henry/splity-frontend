"use client";

import Image from "next/image";
import { NavBar_Event_Details } from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import Expenses_Card from "@/components/Expenses_Card/Expenses_Card";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useGroup } from "@/context/GroupContext";
import { useExpenses } from "@/context/ExpensesContext"; // Importa el ExpensesContext

export const Event_Details = () => {
  const [state, setState] = useState("Gastos");
  const { slug } = useParams();
  const { actualGroup, fetchGroupById, loadingGroups, groupErrors } = useGroup();
  const { getExpensesByGroupId } = useExpenses(); // Obtén la función del contexto

  console.log("Este es el grupo actual", actualGroup);

  const loadGroupData = useCallback(() => {
    if (slug) {
      fetchGroupById(Array.isArray(slug) ? slug[0] : slug);
    }
  }, [slug]);

  useEffect(() => {
    loadGroupData();
  }, [loadGroupData]);

  // Llama a getExpensesByGroupId cuando actualGroup cambia y tiene un ID
  useEffect(() => {
    if (actualGroup?.id) {
      getExpensesByGroupId(actualGroup.id.toString());
    }
  }, [actualGroup?.id]); // Dependencias importantes

  if (loadingGroups) {
    return <div>Cargando detalles del evento...</div>;
  }

  if (groupErrors.length > 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
        {groupErrors.map((error, index) => (
          <p key={index} className="text-sm">{error}</p>
        ))}
      </div>
    );
  }

  if (!actualGroup) {
    return <div>No se pudo cargar la información del evento.</div>;
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
      {state === "Gastos" && <Expenses_Card />}
      <NavBar_Event_Details slugNumber={Number(Array.isArray(slug) ? slug[0] : slug)} />
    </div>
  );
};

export default Event_Details;