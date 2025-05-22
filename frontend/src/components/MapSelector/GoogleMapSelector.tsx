// src/components/MapSelector/GoogleMapSelector.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react"; // Agregamos useCallback
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { LatLngLiteral } from "leaflet"; // Asegúrate de que LatLngLiteral esté importado correctamente si lo usas de 'leaflet'

console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

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
  const searchInputRef = useRef<HTMLInputElement>(null); // Referencia para el campo de búsqueda
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // Referencia para Autocomplete

  // Función para realizar geocodificación inversa y actualizar el nombre de la ubicación
  const reverseGeocode = useCallback(
    (latLng: LatLngLiteral) => {
      if (geocoder.current) {
        geocoder.current.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setLocationName(results[0].formatted_address || "");
          } else {
            console.error("Geocoder falló debido a: " + status + " para " + JSON.stringify(latLng));
          }
        });
      }
    },
    [setLocationName]
  );

  useEffect(() => {
    // Inicialización del mapa
    if (ref.current && !map) {
      const initialPosition = location || { lat: -34.61, lng: -58.38 }; // CABA por defecto

      const newMap = new google.maps.Map(ref.current, {
        center: initialPosition,
        zoom: 13,
      });
      setMap(newMap);

      markerRef.current = new google.maps.Marker({
        position: initialPosition,
        map: newMap,
      });
      geocoder.current = new google.maps.Geocoder();

      // Configurar el autocompletado en el campo de búsqueda
      if (searchInputRef.current) {
        autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current, {
          types: ["geocode"], // Limitar a resultados geográficos
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.geometry?.location) {
            const newLatLng = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setLocation(newLatLng); // Actualizar la ubicación en el estado superior
            setLocationName(place.formatted_address || place.name || ""); // Actualizar el nombre
            newMap.setCenter(newLatLng); // Centrar el mapa
            markerRef.current?.setPosition(newLatLng); // Mover el marcador
          } else {
            console.error("No se encontraron detalles para el lugar seleccionado.");
          }
        });
      }

      // Listener para el clic en el mapa
      newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerRef.current) {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          markerRef.current.setPosition(newPosition);
          setLocation(newPosition);
          reverseGeocode(newPosition); // Actualizar el nombre de la ubicación al hacer clic
        }
      });
    }

    // Actualización del mapa y marcador cuando la prop 'location' cambia externamente
    if (map && location && markerRef.current) {
      map.setCenter(location);
      markerRef.current.setPosition(location);
      // Actualizar el campo de texto de búsqueda si la ubicación cambia externamente
      // Esto evita que el campo muestre una ubicación diferente a la del mapa si se actualiza el prop
      if (searchInputRef.current && searchInputRef.current.value === "") { // Solo si el campo está vacío
        reverseGeocode(location);
      }
    }
  }, [map, location, setLocation, reverseGeocode]); // Añadir reverseGeocode a las dependencias

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Buscar ubicación..."
        style={{
          width: 'calc(100% - 20px)',
          padding: '10px',
          margin: '10px 10px 0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          position: 'absolute', // Posicionamiento absoluto para superponer al mapa
          zIndex: 1, // Asegura que esté por encima del mapa
        }}
      />
      <div ref={ref} style={{ height: "300px", width: "100%", marginTop: '50px' }} /> {/* Espacio para el input */}
    </div>
  );
};