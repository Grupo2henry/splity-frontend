/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import fetchExpenses from '@/services/expenses-services/fetchExpenses';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import styles from './ReceiptsBoard.module.css';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  imgUrl: string;
  paid_by: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface Props {
  groupId: string;
}

const ReceiptsBoard = ({ groupId }: Props) => {
  const { message, showAlert, onClose } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (typeof groupId === 'string') {
      const fetchReceipts = async () => {
        try {
          const result = await fetchExpenses(Number(groupId));
          if (!result) {
            showAlert('No se pudieron obtener los comprobantes.');
          } else {
            setExpenses(result);
          }
        } catch (error) {
          console.error('Error al obtener los comprobantes:', error);
          showAlert('Error al obtener los comprobantes del grupo.');
        } finally {
          setLoading(false);
        }
      };

      fetchReceipts();
    }
  }, [groupId]);

  if (loading) {
    return <div className={styles.loading}>Cargando comprobantes...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {expenses.length > 0 ? (
          <div className={styles.receiptsList}>
            {expenses.map((expense) => (
              <div key={expense.id} className={styles.receiptCard}>
                <div className={styles.receiptHeader}>
                  <h2 className={styles.receiptTitle} title={expense.description}>
                    {expense.description}
                  </h2>
                  <span className={styles.receiptAmount}>AR$ {expense.amount}</span>
                </div>
                {expense.imgUrl ? (
                  <a
                    href={expense.imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.imageContainer}
                  >
                    <Image
                      src={expense.imgUrl}
                      alt={expense.description}
                      fill
                      className="object-cover"
                    />
                  </a>
                ) : (
                  <div className={styles.noImage}>
                    <p className={styles.noImageText}>No hay imagen disponible</p>
                  </div>
                )}
                <div className={styles.receiptFooter}>
                  <span>Pagado por: {expense.paid_by?.name || 'Desconocido'}</span>
                  <span>{new Date(expense.date).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noReceipts}>
            <p>No hay comprobantes registrados en este grupo.</p>
          </div>
        )}
      </div>

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default ReceiptsBoard;