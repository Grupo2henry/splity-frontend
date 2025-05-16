/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/BalanceContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGroup } from "./GroupContext"; // Importa el GroupContext
import { fetchGroupBalance } from "@/services/fetchGroupBalance"; // Importa el servicio de balance
import { 
    BalanceContextType, 
    BalanceByUser, 
    RecommendedLiquidation,
    BalanceResponse
 } from "./interfaces/balance.interface";
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance debe usarse dentro de un BalanceProvider");
  }
  return context as BalanceContextType;
};

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balanceByUser, setBalanceByUser] = useState<BalanceByUser[]>([]);
  const [recommendedLiquidations, setRecommendedLiquidations] = useState<RecommendedLiquidation[]>([]);
  const [balanceErrors, setBalanceErrors] = useState<string[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const { actualGroup } = useGroup(); // Obtén actualGroup del GroupContext

  useEffect(() => {
    if (balanceErrors.length > 0) {
      const timer = setTimeout(() => setBalanceErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [balanceErrors]);

  useEffect(() => {
    if (actualGroup?.id) {
      getBalancesByGroupId(actualGroup.id.toString());
    } else {
      setBalanceByUser([]);
      setRecommendedLiquidations([]);
    }
  }, [actualGroup]);

  const getBalancesByGroupId = async (groupId: string): Promise<void> => {
    setLoadingBalances(true);
    setBalanceErrors([]);
    try {
      const fetchedBalances: BalanceResponse | undefined = await fetchGroupBalance(groupId);
      if (fetchedBalances) {
        setBalanceByUser(fetchedBalances.balanceByUser);
        setRecommendedLiquidations(fetchedBalances.recommendedLiquidations);
      } else {
        setBalanceByUser([]);
        setRecommendedLiquidations([]);
        setBalanceErrors(["No se pudieron obtener los balances del grupo."]);
      }
    } catch (error: any) {
      console.error(`Error al obtener los balances del grupo ${groupId}:`, error);
      setBalanceErrors([error.message || "Error al obtener los balances."]);
      setBalanceByUser([]);
      setRecommendedLiquidations([]);
    } finally {
      setLoadingBalances(false);
    }
  };

  return (
    <BalanceContext.Provider value={{
      balanceByUser,
      recommendedLiquidations,
      balanceErrors,
      loadingBalances,
      getBalancesByGroupId,
    }}>
      {children}
    </BalanceContext.Provider>
  );
};