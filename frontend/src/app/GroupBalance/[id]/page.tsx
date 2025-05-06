'use client'; // Importante marcar como cliente si usas hooks en este componente o sus hijos

<<<<<<< HEAD
interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { // Next.js espera esta propiedad opcional
    [key: string]: string | string[] | undefined;
  };
}

const GroupBalancePage = async ({ params }: PageProps) => {
  return <GroupBalance groupId={params.id} />;
=======
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
>>>>>>> 882eb58191cb3c04d00e61e41f9a394f9acc5f9a
};

export default GroupBalancePage;