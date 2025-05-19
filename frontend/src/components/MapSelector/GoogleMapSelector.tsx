"use client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface GoogleMapSelectorProps {
  initialLocation?: LatLngLiteral | null;
  onSelectLocation: (location: LatLngLiteral, locationName: string | null) => void;
  markerTitle?: string; // Prop para personalizar el título del marcador
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

const libraries = ["places"] as ("places")[];

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  initialLocation,
  onSelectLocation,
  markerTitle = "Ubicación Seleccionada",
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    initialLocation || null
  );
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(
    initialLocation || { lat: -34.6037, lng: -58.3816 }
  );
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const reverseGeocode = useCallback((location: LatLngLiteral) => {
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    setGeocodeError(null); // Resetear el error antes de la geocodificación
    geocoderRef.current.geocode({ location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        onSelectLocation(location, results[0].formatted_address);
      } else {
        console.error("Error en la geocodificación:", status);
        setGeocodeError(`Error al obtener la dirección (${status}). Por favor, inténtalo de nuevo.`);
        onSelectLocation(location, null);
      }
    });
  }, [onSelectLocation]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newLocation);
      setMapCenter(newLocation);
      reverseGeocode(newLocation);
    }
  }, [reverseGeocode]);

  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onLoadSearchBox = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
  }, []);

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current?.getPlaces?.();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry?.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newLocation);
        setMapCenter(newLocation);
        reverseGeocode(newLocation);
      }
    }
  }, [reverseGeocode]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="space-y-2">
      <StandaloneSearchBox
        onLoad={onLoadSearchBox}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Buscar ubicación..."
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onClick={onMapClick}
        onLoad={onLoadMap}
      >
        {markerPosition && <Marker position={markerPosition} title={markerTitle} />}
      </GoogleMap>

      {geocodeError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
          {geocodeError}
        </div>
      )}
    </div>
  );
};

export default GoogleMapSelector;