/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import fetchExpenses from '@/services/expenses-services/fetchExpenses';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';

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

const Receipts_Board = ({ groupId }: Props) => {
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
    return <div className="text-white text-center mt-10">Cargando comprobantes...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#61587C] rounded-lg text-white">
  {/*     <h1 className="text-[24px] mb-6">Comprobantes del Grupo</h1> */}

      <div className="w-full max-w-6xl">
        {expenses.length > 0 ? (
          <div className="flex flex-col gap-4 w-full">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-[#4B4362] rounded-lg p-4 shadow-md max-w-full w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold truncate" title={expense.description}>
                    {expense.description}
                  </h2>
                  <span className="text-xl font-bold">AR$ {expense.amount}</span>
                </div>
                {expense.imgUrl ? (
                  <a
                    href={expense.imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mb-4"
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={expense.imgUrl}
                        alt={expense.description}
                        width={400}
                        height={160}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center justify-center h-40 mb-4 bg-[#61587C] rounded-lg">
                    <p className="text-gray-300 text-center text-sm">No hay imagen disponible</p>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Pagado por: {expense.paid_by?.name || 'Desconocido'}</span>
                  <span>{new Date(expense.date).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-[#4B4362] rounded-lg">
            <p>No hay comprobantes registrados en este grupo.</p>
          </div>
        )}
      </div>

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default Receipts_Board;