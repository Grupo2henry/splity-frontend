import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { MapSelectorProps } from './types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLng } from 'leaflet';

// Solución a problema de íconos con Webpack/Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapSelector({ onSelectLocation }: MapSelectorProps) {
  const [position, setPosition] = useState<LatLng | null>(null);;

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelectLocation(e.latlng); // { lat: ..., lng: ... }
      },
    });

    return position === null ? null : <Marker position={position} />;
  }

  return (
    <MapContainer center={[-31.4167, -64.1833]} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
