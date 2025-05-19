/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import { useAuth } from '@/context/AuthContext';
import { useMembership } from '@/context/MembershipContext';
import { useState, useEffect } from 'react';
import ProfileEditForm from '@/components/Forms/ProfileEditForm/ProfileEditForm';

const Profile_Board = () => {
  const { user } = useAuth();
  const { message, showAlert, onClose } = useCustomAlert();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleEditProfile = () => {
      setIsEditing(true);
    };

    const profileBoard = document.querySelector('[data-profile-board]');
    if (profileBoard) {
      profileBoard.addEventListener('editProfile', handleEditProfile);
    }

    return () => {
      if (profileBoard) {
        profileBoard.removeEventListener('editProfile', handleEditProfile);
      }
    };
  }, []);

  if (!user) {
    return <div className="text-gray-600 text-center mt-10">Cargando perfil...</div>;
  }

  if (isEditing) {
    return (
      <div className="flex flex-col items-center p-8 bg-white rounded-xl text-gray-800 shadow-sm" data-profile-board>
        <div className="w-full max-w-2xl">
          <ProfileEditForm 
            onCancel={() => setIsEditing(false)}
            onSave={() => {
              setIsEditing(false);
              showAlert('Perfil actualizado correctamente');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl text-gray-800 shadow-sm" data-profile-board>
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                <Image
                  src={user.profile_picture_url || '/default-avatar.svg'}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Información de la cuenta</h3>
            <div className="space-y-6">
              <div>
                <label className="text-gray-500 text-sm font-medium block mb-1">Miembro desde</label>
                <p className="font-medium text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-gray-500 text-sm font-medium block mb-1">Estado de la cuenta</label>
                <p className="font-medium text-gray-900">
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