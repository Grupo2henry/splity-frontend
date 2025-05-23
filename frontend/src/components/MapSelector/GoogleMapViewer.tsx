"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useGoogleMaps } from "@/context/GoogleMapsContext"; // Importa el hook del contexto

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface GoogleMapViewerProps {
  location: LatLngLiteral | null;
  locationName?: string | null;
  markerTitle?: string;
  zoom?: number;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

// Ya no necesitamos 'libraries' aquí, se maneja en el contexto.
// const libraries: ("places")[] = [];

const GoogleMapViewer: React.FC<GoogleMapViewerProps> = ({
  location,
  locationName,
  markerTitle = "Ubicación del Evento",
  zoom = 10,
}) => {
  // Usa el hook useGoogleMaps para obtener el estado de carga
  const { isLoaded, loadError } = useGoogleMaps();

  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(
    location || { lat: -34.6037, lng: -58.3816 } // Default: Buenos Aires
  );
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(
    location
  );
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  useEffect(() => {
    if (location) {
      setMapCenter(location);
      setMarkerPosition(location);
      // Cuando la ubicación cambie externamente, si hay un nombre de ubicación,
      // podrías abrir la InfoWindow automáticamente, o dejarla cerrada.
      // Por ahora, solo actualizamos el centro y el marcador.
    }
  }, [location]);

  // Manejo de estados de carga y error usando el contexto
  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        draggable: false, // El visor no debería ser arrastrable
        scrollwheel: false, // El scrollwheel no debería cambiar el zoom
        clickableIcons: false, // Los íconos de lugares no son clickables
      }}
    >
      {markerPosition && (
        <>
          <Marker
            position={markerPosition}
            onClick={() => setInfoWindowOpen(true)}
            title={locationName || markerTitle}
          />
          {infoWindowOpen && (
            <InfoWindow
              position={markerPosition}
              onCloseClick={() => setInfoWindowOpen(false)}
            >
              <div>
                <strong>{locationName || markerTitle}</strong>
              </div>
            </InfoWindow>
          )}
        </>
      )}
    </GoogleMap>
  );
};

export default GoogleMapViewer;