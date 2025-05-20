/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { NavBar_Event_Details } from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import ExpensesBoard from "@/components/Boards/ExpensesBoard/ExpensesBoard";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useMembership } from "@/context/MembershipContext";
import Loader from "@/components/Loader/Loader";
import BalanceBoard from "@/components/Boards/BalanceBoard/BalanceBoard";
import ReceiptsBoard from "@/components/Boards/ReceiptsBoard/ReceiptsBoard";
import GoogleMapSelector from "@/components/MapSelector/GoogleMapSelector";

// 📍 Tipo para coordenadas
type LatLngLiteral = {
  lat: number;
  lng: number;
};

export const Event_Details = () => {
  const [viewState, setViewState] = useState<"Gastos" | "Saldos" | "Comprobantes">("Gastos");
  const [selectedLocation, setSelectedLocation] = useState<LatLngLiteral | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  const { slug } = useParams();
  const router = useRouter();

  const groupId = useMemo(() => {
    const id = Array.isArray(slug) ? slug[0] : slug;
    const num = Number(id);
    return Number.isNaN(num) ? null : num;
  }, [slug]);

  const {
    actualGroupMembership,
    getActualGroupUserMembership,
    loadingActualGroupUserMembership,
    actualGroupMembershipErrors,
  } = useMembership();

  console.log("longitude: ", actualGroupMembership?.group.longitude, "latitude: ", actualGroupMembership?.group.latitude)

  // 📦 Traer datos del grupo al montar
  useEffect(() => {
    if (groupId !== null) {
      getActualGroupUserMembership(groupId.toString());
    }
  }, [groupId]);

  // 🗺️ Inicializar ubicación seleccionada
  useEffect(() => {
    if (
      actualGroupMembership?.group.latitude &&
      actualGroupMembership?.group.longitude
    ) {
      setSelectedLocation({
        lat: actualGroupMembership.group.latitude,
        lng: actualGroupMembership.group.longitude,
      });
    }

    if (actualGroupMembership?.group.locationName) {
      setLocationName(actualGroupMembership.group.locationName);
    }
  }, [actualGroupMembership]);

  // ❌ Manejar caso de grupo no encontrado
  useEffect(() => {
    if (
      !loadingActualGroupUserMembership &&
      actualGroupMembershipErrors.length === 0 &&
      groupId !== null &&
      !actualGroupMembership
    ) {
      const timer = setTimeout(() => {
        router.push("/Dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [
    actualGroupMembershipErrors,
    groupId,
    router,
    loadingActualGroupUserMembership,
    actualGroupMembership,
  ]);

  if (loadingActualGroupUserMembership) {
    return <Loader isLoading={true} message="Cargando detalles del evento..." />;
  }

  if (actualGroupMembershipErrors.length > 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
        {actualGroupMembershipErrors.map((error, index) => (
          <p key={index} className="text-sm">{error}</p>
        ))}
      </div>
    );
  }

  if (
    !loadingActualGroupUserMembership &&
    groupId !== null &&
    !actualGroupMembership &&
    actualGroupMembershipErrors.length === 0
  ) {
    return (
      <div className="text-white text-center mt-8">
        No se encontró el grupo. Redirigiendo...
      </div>
    );
  }

  console.log(selectedLocation);

  return (
    <div className="flex flex-col w-full h-full items-center">
      <Image src="/logo-splity.png" alt="Logo" width={165} height={175} />

      <div className="flex flex-col w-full h-full items-center mb-6 gap-2">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#61587C] text-5xl">
          {actualGroupMembership?.group.emoji || "📁"}
        </div>
        <p className="text-[16px] text-white text-center">
          {actualGroupMembership?.group.name}
        </p>
        {actualGroupMembership?.group.id && (
          <Link
            href={`/Update_Event/${actualGroupMembership.group.id}`}
            className="text-sm text-blue-500 hover:underline"
          >
            Editar Evento
          </Link>
        )}
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

      {viewState === "Gastos" && <ExpensesBoard />}
      {viewState === "Saldos" && actualGroupMembership?.group.id && <BalanceBoard />}
      {viewState === "Comprobantes" && actualGroupMembership?.group.id && (
        <ReceiptsBoard groupId={actualGroupMembership.group.id.toString()} />
      )}

      {groupId !== null && <NavBar_Event_Details />}
      <div className="flex flex-col items-center gap-4 w-full px-4">
          <p className="text-white text-sm">Ubicación del comprobante</p>

          <div className="w-full h-[300px] rounded-lg overflow-hidden pointer-events-none">
            <GoogleMapSelector
              initialLocation={selectedLocation}
              onSelectLocation={() => {
                // Esta función no debe hacer nada ya que el mapa no es modificable
              }}
            />
          </div>
          {selectedLocation && (
            <div className="text-white text-xs text-center mt-2">
              Ubicación: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
              {locationName && (
                <div className="mt-1 italic">({locationName})</div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default Event_Details;