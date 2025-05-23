"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import React, { createContext, useContext } from "react";

const libraries: ("places")[] = ["places"];

const GoogleMapsContext = createContext<{ isLoaded: boolean; loadError: Error | undefined }>({
  isLoaded: false,
  loadError: undefined,
});

export const GoogleMapsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
