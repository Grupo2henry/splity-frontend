 'use client';

import { useEffect } from 'react';
import CustomAlert, { useCustomAlert } from '../../CustomAlert/CustomAlert';
import { useBalance } from '@/context/BalanceContext';

const BalanceBoard = () => {
  const { message, showAlert, onClose } = useCustomAlert();
  const {
    balanceByUser,
    recommendedLiquidations,
    loadingBalances,
    balanceErrors,// Ya no lo usamos directamente aquí
  } = useBalance();

  useEffect(() => {
    if (balanceErrors.length > 0) {
      showAlert(balanceErrors[0]);
    }
  }, [balanceErrors, showAlert]);

  return (
    <div className="flex flex-col items-center p-6 bg-[#61587C] rounded-lg text-white">
      <h1 className="text-[24px] mb-6">Balance del Grupo</h1>

      {loadingBalances && <p className="text-white">Cargando balance...</p>}

      {!loadingBalances && balanceByUser && recommendedLiquidations && (
        <>
          <div className="w-full max-w-xl mb-8">
            <h2 className="text-[20px] mb-4">Saldos individuales</h2>
            <ul className="space-y-3">
              {balanceByUser.map((user) => (
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
            {recommendedLiquidations.length > 0 ? (
              <ul className="space-y-3">
                {recommendedLiquidations.map((liq, idx) => (
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

export default BalanceBoard;