// src/components/MapSelector/GoogleMapSelector.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { LatLngLiteral } from "leaflet";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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

      // Listener para el clic en el mapa
      newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerRef.current) {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          markerRef.current.setPosition(newPosition);
          setLocation(newPosition);
          reverseGeocode(newPosition);
        }
      });
    }
  }, [map, location, setLocation, reverseGeocode]);

  useEffect(() => {
    // Configurar el autocompletado en el campo de búsqueda una vez que el mapa esté inicializado
    // y la librería de Places esté disponible.
    if (map && searchInputRef.current && !autocompleteRef.current) {
      // Acceder a google.maps.places a través de la instancia del mapa si es posible
      // O asegurar que google.maps.places esté disponible globalmente.
      // Ya que Wrapper carga la librería "places", debería estar disponible.
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            types: ["geocode"],
          });

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.geometry?.location) {
              const newLatLng = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              setLocation(newLatLng);
              setLocationName(place.formatted_address || place.name || "");
              map.setCenter(newLatLng);
              markerRef.current?.setPosition(newLatLng);
            } else {
              console.error("No se encontraron detalles para el lugar seleccionado.");
            }
          });
        } else {
          console.warn("google.maps.places no está disponible aún. Reintentando...");
        }
      } catch (e) {
        console.error("Error al inicializar Autocomplete:", e);
      }
    }
  }, [map, setLocation, setLocationName]); // Añadir map a las dependencias

  // Actualización del mapa y marcador cuando la prop 'location' cambia externamente
  useEffect(() => {
    if (map && location && markerRef.current) {
      map.setCenter(location);
      markerRef.current.setPosition(location);
      if (searchInputRef.current && searchInputRef.current.value === "") {
        reverseGeocode(location);
      }
    }
  }, [map, location, reverseGeocode]);


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
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <div ref={ref} style={{ height: "300px", width: "100%", marginTop: '50px' }} />
    </div>
  );
};