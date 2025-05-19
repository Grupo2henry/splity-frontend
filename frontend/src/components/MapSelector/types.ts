export interface MapSelectorProps {
  onSelectLocation: (latlng: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number } | null; // Añade esta línea
}