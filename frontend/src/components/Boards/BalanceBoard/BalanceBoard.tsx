'use client';

import { useEffect } from 'react';
import CustomAlert, { useCustomAlert } from '../../CustomAlert/CustomAlert';
import { useBalance } from '@/context/BalanceContext';
import styles from './BalanceBoard.module.css';

const BalanceBoard = () => {
  const { message, showAlert, onClose } = useCustomAlert();
  const {
    balanceByUser,
    recommendedLiquidations,
    loadingBalances,
    balanceErrors,
  } = useBalance();

  useEffect(() => {
    if (balanceErrors.length > 0) {
      showAlert(balanceErrors[0]);
    }
  }, [balanceErrors, showAlert]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Balance del Grupo</h1>

      {loadingBalances && <p className={styles.loading}>Cargando balance...</p>}

      {!loadingBalances && balanceByUser && recommendedLiquidations && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Saldos individuales</h2>
            <ul className={styles.list}>
              {balanceByUser.map((user) => (
                <li
                  key={user.userId}
                  className={`${styles.balanceItem} ${
                    user.balance > 0
                      ? styles.positiveBalance
                      : user.balance < 0
                      ? styles.negativeBalance
                      : styles.neutralBalance
                  }`}
                >
                  <span>{user.name}</span>
                  <span>AR$ {user.balance.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Recomendación de liquidación</h2>
            {recommendedLiquidations.length > 0 ? (
              <ul className={styles.list}>
                {recommendedLiquidations.map((liq, idx) => (
                  <li key={idx} className={styles.liquidationItem}>
                    <span>
                      {liq.debtorName} → {liq.creditorName}
                    </span>
                    <span>AR$ {liq.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noDebts}>No hay deudas pendientes</p>
            )}
          </div>
        </>
      )}

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default BalanceBoard;