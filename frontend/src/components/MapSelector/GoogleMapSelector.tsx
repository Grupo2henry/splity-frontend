// src/components/MapSelector/GoogleMapSelector.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useGoogleMaps } from "@/context/GoogleMapsContext";
// Importa los estilos de EventForm.module.css
import styles from "@/components/Forms/EventForm/EventForm.module.css"; 


interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationChange: (latLng: LatLngLiteral | null, name?: string) => void;
  location: LatLngLiteral | null;
  initialLocationName?: string;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

const GoogleMapSelector: React.FC<MapComponentProps> = ({
  location,
  onLocationChange,
  initialLocationName = "",
}) => {
  const { isLoaded, loadError } = useGoogleMaps();

  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(
    location || { lat: -34.6037, lng: -58.3816 } // Buenos Aires por defecto
  );
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    location
  );
  const [searchText, setSearchText] = useState<string>(initialLocationName);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (location) {
      setMapCenter(location);
      setMarkerPosition(location);
      if (initialLocationName && searchText !== initialLocationName) {
         setSearchText(initialLocationName);
      } else if (!initialLocationName && location) {
          reverseGeocode(location);
      }
    } else {
        setMapCenter({ lat: -34.6037, lng: -58.3816 });
        setMarkerPosition(null);
        setSearchText("");
    }
  }, [location, initialLocationName]);

  const reverseGeocode = (latLng: LatLngLiteral) => {
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const name = results[0].formatted_address || "";
          setSearchText(name);
          onLocationChange(latLng, name);
        } else {
          console.error("Geocoder falló debido a: " + status);
          onLocationChange(latLng, "");
        }
      });
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (
        place.geometry &&
        place.geometry.location &&
        typeof place.geometry.location.lat === "function"
      ) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.formatted_address || place.name || "";
        const latLng = { lat, lng };
        setMarkerPosition(latLng);
        setMapCenter(latLng);
        setSearchText(name);
        onLocationChange(latLng, name);
      } else {
        console.error("No se encontraron detalles de ubicación para el lugar seleccionado.");
        setSearchText("");
        onLocationChange(null, "");
      }
    }
  };

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="flex flex-col gap-2">
      {/* Aplica las clases de estilo al input */}
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          if (inputRef.current && searchText) {
            inputRef.current.value = searchText;
          }
        }}
        onPlaceChanged={onPlaceChanged}
        options={{ types: ["geocode"] }}
      >
        {/* Aquí aplicamos las clases CSS */}
        <input
          type="text"
          ref={inputRef}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar ubicación..."
          className={styles.input} // Clase para el estilo base del input
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={(e) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (lat && lng) {
            const newLocation = { lat, lng };
            setMarkerPosition(newLocation);
            setMapCenter(newLocation);
            reverseGeocode(newLocation);
          }
        }}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapSelector;