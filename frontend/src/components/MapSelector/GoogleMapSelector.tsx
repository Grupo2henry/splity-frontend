// src/components/MapSelector/GoogleMapSelector.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { LatLngLiteral } from "leaflet"; // Asegúrate de que LatLngLiteral esté importado correctamente si lo usas de 'leaflet'

interface GoogleMapSelectorProps {
  location: LatLngLiteral | null;
  setLocation: (location: LatLngLiteral) => void;
  setLocationName: (name: string) => void;
}

const renderStatus = (status: Status) => {
  if (status === Status.FAILURE) return <p>Fallo al cargar los mapas</p>;
  return <p>Cargando mapa...</p>;
};

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  location,
  setLocation,
  setLocationName,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
    return <p>Error: falta API Key</p>;
  }

  return (
    <Wrapper apiKey={apiKey} render={renderStatus} libraries={["places"]}>
      <MapComponent
        location={location}
        setLocation={setLocation}
        setLocationName={setLocationName}
      />
    </Wrapper>
  );
};

export default GoogleMapSelector;

const MapComponent: React.FC<GoogleMapSelectorProps> = ({
  location,
  setLocation,
  setLocationName,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    // Si el mapa no ha sido inicializado y tenemos la referencia al div
    if (ref.current && !map) {
      // Usar la ubicación pasada por props, o la de CABA por defecto si no hay
      const initialPosition = location || { lat: -34.61, lng: -58.38 }; // CABA por defecto

      const newMap = new google.maps.Map(ref.current, {
        center: initialPosition, // Centrar el mapa en la ubicación inicial
        zoom: 13,
      });
      setMap(newMap);

      markerRef.current = new google.maps.Marker({
        position: initialPosition, // Posicionar el marcador en la ubicación inicial
        map: newMap,
      });
      geocoder.current = new google.maps.Geocoder();

      // Añadir el listener para el clic en el mapa
      newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerRef.current) {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          markerRef.current.setPosition(newPosition);
          setLocation(newPosition);

          if (geocoder.current) {
            geocoder.current.geocode({ location: newPosition }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                setLocationName(results[0].formatted_address || "");
              } else {
                console.error("Geocoder falló debido a: " + status);
              }
            });
          }
        }
      });
    }

    // Este bloque se ejecutará cada vez que 'location' cambie
    // (después de la inicialización o por un cambio externo)
    if (map && location && markerRef.current) {
      map.setCenter(location);
      markerRef.current.setPosition(location);

      // Opcional: Si quieres actualizar el locationName cuando 'location' cambie externamente
      if (geocoder.current) {
        geocoder.current.geocode({ location: location }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setLocationName(results[0].formatted_address || "");
          }
        });
      }
    }
  }, [map, location, setLocation, setLocationName]); // Dependencias: map, location, setLocation, setLocationName

  return <div ref={ref} style={{ height: "300px", width: "100%" }} />;
};