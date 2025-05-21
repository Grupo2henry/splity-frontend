/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { NavBar_Event_Details } from "@/components/NavBar/NavBar_Event_Details/NaBar_Event_Details";
import ExpensesBoard from "@/components/Boards/ExpensesBoard/ExpensesBoard";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useMembership } from "@/context/MembershipContext";
import Loader from "@/components/Loader/Loader";
import BalanceBoard from "@/components/Boards/BalanceBoard/BalanceBoard";
import ReceiptsBoard from "@/components/Boards/ReceiptsBoard/ReceiptsBoard";
import GoogleMapViewer from "@/components/MapSelector/GoogleMapViewer";
import styles from "./Event_Details.module.css";

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
    <div className={styles.container}>
      <div className={styles.eventHeader}>
        <div className={styles.emojiContainer}>
          {actualGroupMembership?.group.emoji || "📁"}
        </div>
        <h1 className={styles.eventName}>
          {actualGroupMembership?.group.name}
        </h1>
        {actualGroupMembership?.group.id && (
          <Link
            href={`/Update_Event/${actualGroupMembership.group.id}`}
            className={styles.editLink}
          >
            Editar Evento
          </Link>
        )}
      </div>

      <div className={styles.tabsContainer}>
        {["Gastos", "Saldos", "Comprobantes"].map((item) => (
          <button
            key={item}
            className={`${styles.tabButton} ${
              viewState === item ? styles.tabButtonActive : ""
            }`}
            onClick={() => setViewState(item as typeof viewState)}
          >
            {item}
          </button>
        ))}
      </div>

      {viewState === "Gastos" && <ExpensesBoard />}
      {viewState === "Saldos" && actualGroupMembership?.group.id && <BalanceBoard />}
      {viewState === "Comprobantes" && actualGroupMembership?.group.id && (
        <ReceiptsBoard groupId={actualGroupMembership.group.id.toString()} />
      )}

      {groupId !== null && <NavBar_Event_Details />}
      <div className="flex flex-col items-center gap-4 w-full px-4">
    <p className="text-white text-sm mt-5">Ubicación del Grupo</p>
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      {/* Usar el nuevo componente GoogleMapViewer */}
      <GoogleMapViewer
        location={selectedLocation}
        locationName={locationName}
        zoom={12} // Puedes ajustar el zoom para la visualización
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