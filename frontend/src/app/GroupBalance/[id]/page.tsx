'use client'; // Importante marcar como cliente si usas hooks en este componente o sus hijos


import BalanceBoard from '@/components/Balance_Board/Balance_Board';
import { useParams } from 'next/navigation'; // Hook para acceder a los parámetros de la ruta
import { useEffect } from 'react';

const GroupBalancePage = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el valor del parámetro 'id' de la ruta

  useEffect(() => {
    if (id) {
      localStorage.setItem('currentGroupId', id); // Si necesitas guardarlo
    }
  }, [id]);

  return (
    <div className="p-4">
      <h1>Balance del Grupo {id}</h1>
      <BalanceBoard groupId={id} /> {/* Pasa el 'id' como prop a BalanceBoard */}
    </div>
  );

};

export default GroupBalancePage;