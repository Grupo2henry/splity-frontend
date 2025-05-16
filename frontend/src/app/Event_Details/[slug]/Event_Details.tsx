/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { NavBar_Event_Details } from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import Expenses_Card from "@/components/Expenses_Card/Expenses_Card";
import { useParams, useRouter } from "next/navigation"; // Importa useRouter
import { useMemo, useState, useEffect } from "react";
import { useGroup } from "@/context/GroupContext";
import Loader from "@/components/Loader/Loader"; // Importa el Loader

export const Event_Details = () => {
  const [viewState, setViewState] = useState<"Gastos" | "Saldos" | "Comprobantes">("Gastos");
  const { slug } = useParams();
  const router = useRouter(); // Inicializa el router

  // 🧠 Memoizar el ID del grupo y validarlo
  const groupId = useMemo(() => {
    const id = Array.isArray(slug) ? slug[0] : slug;
    const num = Number(id);
    return Number.isNaN(num) ? null : num;
  }, [slug]);

  const { actualGroup, fetchGroupById, loadingGroups, groupErrors } = useGroup();

  // 📦 Traer datos del grupo al montar
  useEffect(() => {
    if (groupId !== null) {
      fetchGroupById(groupId.toString());
    }
  }, [groupId]);

  useEffect(() => {
    if (!loadingGroups && groupErrors.length === 0 && groupId !== null && !actualGroup) {
      const timer = setTimeout(() => {
        router.push("/Dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [groupErrors, groupId, router, loadingGroups, actualGroup]);

  // 🧾 Estados de carga y error
  if (loadingGroups) {
    return <Loader isLoading={true} message="Cargando detalles del evento..." />;
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

  if (!loadingGroups && groupId !== null && !actualGroup && groupErrors.length === 0) {
    return (
      <div className="text-white text-center mt-8">
        No se encontró el grupo. Redirigiendo...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center">
      <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />

      <div className="flex flex-col w-full h-full items-center mb-6 gap-2">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#61587C] text-5xl">
          {actualGroup?.emoji || "📁"}
        </div>
        <p className="text-[16px] text-white text-center">{actualGroup?.name}</p>
      </div>

      <div className="flex w-full rounded-lg bg-[#61587C] gap-2 p-2 items-center justify-between mb-6">
        {["Gastos", "Saldos", "Comprobantes"].map((item) => (
          <div key={item} className="flex w-1/3 justify-center">
            <button
              className={`custom-input font-bold ${
                viewState === item ? "text-gray-700" : "text-gray-400"
              }`}
              onClick={() => setViewState(item as typeof viewState)}
            >
              {item}
            </button>
          </div>
        ))}
      </div>

      {viewState === "Gastos" && <Expenses_Card />}
      {/* Placeholder para futuros componentes */}
      {viewState === "Saldos" && (
        <div className="text-white">Saldos: función en desarrollo</div>
      )}
      {viewState === "Comprobantes" && (
        <div className="text-white">Comprobantes: función en desarrollo</div>
      )}

      {groupId !== null && <NavBar_Event_Details slugNumber={groupId} />}
    </div>
  );
};

export default Event_Details;