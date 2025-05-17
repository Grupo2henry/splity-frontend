
export interface BalanceByUser {
  userId: string;
  name: string;
  balance: number;
}

export interface RecommendedLiquidation {
  debtorId: string;
  debtorName: string;
  creditorId: string;
  creditorName: string;
  amount: number;
}

export interface BalanceResponse {
  balanceByUser: BalanceByUser[];
  recommendedLiquidations: RecommendedLiquidation[];
}

export interface BalanceContextType {
  balanceByUser: BalanceByUser[];
  recommendedLiquidations: RecommendedLiquidation[];
  balanceErrors: string[];
  loadingBalances: boolean;
  getBalancesByGroupId: (groupId: string) => Promise<void>;
}
