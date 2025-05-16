export interface MapSelectorProps {
  onSelectLocation: (latlng: { lat: number; lng: number }) => void;
}