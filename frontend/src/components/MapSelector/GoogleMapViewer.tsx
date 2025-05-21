"use client";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";

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

const libraries: ("places")[] = [];

const GoogleMapViewer: React.FC<GoogleMapViewerProps> = ({
  location,
  locationName,
  markerTitle = "Ubicación del Evento",
  zoom = 10,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

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
    }
  }, [location]);

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
        draggable: false,
        scrollwheel: false,
        clickableIcons: false,
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
