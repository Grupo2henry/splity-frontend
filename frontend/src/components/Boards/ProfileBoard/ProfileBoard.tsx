/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import { useAuth } from '@/context/AuthContext';
import { useMembership } from '@/context/MembershipContext';
import { useState } from 'react';

const Profile_Board = () => {
  const { user } = useAuth();
  const { message, showAlert, onClose } = useCustomAlert();

  if (!user) {
    return <div className="text-gray-600 text-center mt-10">Cargando perfil...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg text-gray-800">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <Image
                  src={user.profile_picture_url || '/default-avatar.svg'}
                  alt="Profile"
                  width={52}
                  height={52}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            {user.active && (
              <span className="bg-green-500 px-3 py-1 rounded-full text-xs text-white">
                Activo
              </span>
            )}
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Información de la cuenta</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-500 text-sm block">Miembro desde</label>
                <p className="font-medium text-gray-800">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-gray-500 text-sm block">Estado de la cuenta</label>
                <p className="font-medium text-gray-800">
                  {user.active ? 'Cuenta activa' : 'Cuenta inactiva'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default Profile_Board;