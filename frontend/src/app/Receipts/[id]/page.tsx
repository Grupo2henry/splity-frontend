'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import ReceiptsBoard from '@/components/Boards/ReceiptsBoard/ReceiptsBoard';

const ReceiptsPage = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      localStorage.setItem('currentGroupId', id);
    }
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Comprobantes del Grupo {id}</h1>
      <ReceiptsBoard groupId={id} />
    </div>
  );
};

export default ReceiptsPage; 