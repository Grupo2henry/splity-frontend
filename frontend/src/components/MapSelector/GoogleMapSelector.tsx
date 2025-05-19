"use client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface GoogleMapSelectorProps {
  initialLocation?: LatLngLiteral | null;
  onSelectLocation: (location: LatLngLiteral) => void;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  initialLocation,
  onSelectLocation,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"], // Necesario para Autocomplete
  });

  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    initialLocation || null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const defaultCenter = initialLocation || { lat: -34.6037, lng: -58.3816 }; // Buenos Aires

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setMarkerPosition(newLocation);
        onSelectLocation(newLocation);
      }
    },
    [onSelectLocation]
  );

  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (
        place.geometry &&
        place.geometry.location
      ) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newLocation);
        mapRef.current?.panTo(newLocation);
        onSelectLocation(newLocation);
      }
    }
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="space-y-2">
      <Autocomplete
        onLoad={onLoadAutocomplete}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Buscar ubicación..."
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={10}
        onClick={onMapClick}
        onLoad={onLoadMap}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapSelector;
