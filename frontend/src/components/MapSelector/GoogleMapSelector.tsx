// src/components/MapSelector/GoogleMapSelector.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { LatLngLiteral } from "leaflet";

interface GoogleMapSelectorProps {
  location: LatLngLiteral | null;
  setLocation: (location: LatLngLiteral) => void;
  setLocationName: (name: string) => void;
}

const renderStatus = (status: Status) => {
  if (status === Status.FAILURE) return <p>Failed to load maps</p>;
  return <p>Loading...</p>;
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
      <MapComponent location={location} setLocation={setLocation} setLocationName={setLocationName} />
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      const initial = location || { lat: -34.61, lng: -58.38 }; // CABA por defecto
      const newMap = new google.maps.Map(ref.current, {
        center: initial,
        zoom: 13,
      });
      setMap(newMap);
      markerRef.current = new google.maps.Marker({
        position: initial,
        map: newMap,
      });
      geocoder.current = new google.maps.Geocoder();

      newMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markerRef.current) {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          markerRef.current.setPosition(newPosition);
          setLocation(newPosition);

          if (geocoder.current) {
            geocoder.current.geocode({ location: newPosition }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                setLocationName(results[0].formatted_address || "");
              }
            });
          }
        }
      });
    }

    if (map && location && markerRef.current) {
      map.setCenter(location);
      markerRef.current.setPosition(location);
    }
  }, [map, location, setLocation, setLocationName]);

  return <div ref={ref} style={{ height: "300px", width: "100%" }} />;
};
