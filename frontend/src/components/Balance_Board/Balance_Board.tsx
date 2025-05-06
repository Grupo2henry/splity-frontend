'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchGroupBalance } from '@/services/fetchGroupBalance';
import CustomAlert, { useCustomAlert } from '../CustomAlert/CustomAlert';

interface BalanceByUser {
  userId: string;
  name: string;
  balance: number;
}

interface Liquidation {
  debtorId: string;
  debtorName: string;
  creditorId: string;
  creditorName: string;
  amount: number;
}

interface BalanceResponse {
  balanceByUser: BalanceByUser[];
  recommendedLiquidations: Liquidation[];
}

interface Props {
  groupId: string;
}

const Balance_Board = ({ groupId }: Props) => {
  const { message, showAlert, onClose } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);

  useEffect(() => {
    if (typeof groupId === 'string') {
      const fetchBalance = async () => {
        try {
          const result = await fetchGroupBalance(groupId);
          if (!result) {
            showAlert('No se pudo obtener el balance.');
          } else {
            setBalance(result);
          }
        } catch (error) {
          console.error('Error al obtener el balance:', error);
          showAlert('Error al obtener el balance del grupo.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchBalance();
    }
  }, [groupId]);

  return (
    <div className="flex flex-col items-center p-6 bg-[#61587C] rounded-lg text-white">
      <h1 className="text-[24px] mb-6">Balance del Grupo</h1>

      {loading && <p className="text-white">Cargando balance...</p>}

      {!loading && balance && (
        <>
          <div className="w-full max-w-xl mb-8">
            <h2 className="text-[20px] mb-4">Saldos individuales</h2>
            <ul className="space-y-3">
              {balance.balanceByUser.map((user) => (
                <li
                  key={user.userId}
                  className={`p-4 rounded-md flex justify-between shadow-md ${
                    user.balance > 0
                      ? 'bg-green-700'
                      : user.balance < 0
                      ? 'bg-red-700'
                      : 'bg-gray-600'
                  }`}
                >
                  <span>{user.name}</span>
                  <span>${user.balance.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-xl">
            <h2 className="text-[20px] mb-4">Recomendación de liquidación</h2>
            {balance.recommendedLiquidations.length > 0 ? (
              <ul className="space-y-3">
                {balance.recommendedLiquidations.map((liq, idx) => (
                  <li
                    key={idx}
                    className="bg-[#4B4362] p-4 rounded-md flex justify-between shadow-md"
                  >
                    <span>
                      {liq.debtorName} → {liq.creditorName}
                    </span>
                    <span>${liq.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">No hay deudas pendientes.</p>
            )}
          </div>
        </>
      )}

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default Balance_Board;
