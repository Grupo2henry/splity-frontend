'use client';

import { useEffect, useState } from 'react';
import fetchUserDetails from '@/services/fetchUserDetails';
import { useCustomAlert } from '@/components/CustomAlert/CustomAlert';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  created_at: string;
  active: boolean;
}

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useCustomAlert();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDetails();
        setUserDetails(data);
      } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        showAlert('No se pudieron cargar los detalles del usuario');
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [showAlert]);

  if (loading) {
    return <div className="text-white text-center">Cargando detalles del usuario...</div>;
  }

  if (!userDetails) {
    return <div className="text-white text-center">No se encontraron detalles del usuario</div>;
  }

  return (
    <div className="bg-[#61587C] rounded-lg p-4 text-white">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Perfil de Usuario</h2>
          {userDetails.active && (
            <span className="bg-green-500 px-2 py-1 rounded-full text-xs">Activo</span>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <div>
            <label className="text-gray-300 text-sm">Nombre</label>
            <p className="font-semibold">{userDetails.name}</p>
          </div>
          
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <p className="font-semibold">{userDetails.email}</p>
          </div>
          
          <div>
            <label className="text-gray-300 text-sm">Miembro desde</label>
            <p className="font-semibold">
              {new Date(userDetails.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 