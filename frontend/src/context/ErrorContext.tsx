// src/context/ErrorContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ErrorContextType {
  triggerError: (message: string, redirectTo?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const triggerError = (message: string, redirectTo = "/Login") => {
    setError(message);
    setTimeout(() => {
      setError(null);
      router.push(redirectTo);
    }, 5000); // opcional: espera para mostrar modal antes de redirigir
  };

  return (
    <ErrorContext.Provider value={{ triggerError }}>
      {children}
      {error && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-4 text-center z-50">
          {error}
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
