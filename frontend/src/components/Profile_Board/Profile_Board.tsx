/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import { useAuth } from '@/context/AuthContext';
import { useMembership } from '@/context/MembershipContext';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Profile_Board = () => {
  const { user } = useAuth();
  const { message, showAlert, onClose } = useCustomAlert();
  const { userMemberships } = useMembership();
  const [isGroupsOpen, setIsGroupsOpen] = useState(true); // Estado para controlar si la sección de grupos está abierta

  console.log("Miembro de: ", userMemberships);

  if (!user) {
    return <div className="text-white text-center mt-10">Cargando perfil...</div>;
  }

  const toggleGroups = () => {
    setIsGroupsOpen(!isGroupsOpen);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-[#61587C] rounded-lg text-white">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-[#4B4362] p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#61587C] flex items-center justify-center">
                <Image
                  src={user.profile_picture_url || '/default-avatar.svg'}
                  alt="Profile"
                  width={52}
                  height={52}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            </div>
            {user.active && (
              <span className="bg-green-500 px-3 py-1 rounded-full text-xs">
                Activo
              </span>
            )}
          </div>

          <div className="bg-[#4B4362] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Información de la cuenta</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block">Miembro desde</label>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-gray-300 text-sm block">Estado de la cuenta</label>
                <p className="font-medium">
                  {user.active ? 'Cuenta activa' : 'Cuenta inactiva'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#4B4362] rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleGroups}
            >
              <h3 className="text-lg font-semibold">Grupos</h3>
              {isGroupsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {userMemberships.length > 0 && isGroupsOpen ? (
              <div className="space-y-3 mt-4">
                {userMemberships.map((membership) => (
                  <div key={membership.id} className="bg-[#61587C] p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{membership.group.name}</h4>
                        {membership.group.emoji && (
                          <span className="mr-2">{membership.group.emoji}</span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          membership.role === 'group_admin' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}
                      >
                        {membership.role === 'group_admin' ? 'Admin' : membership.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">
                      Se unió el {new Date(membership.joined_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !isGroupsOpen && (
                <p className="text-center text-gray-300 mt-4">
                  {userMemberships.length === 0 ? 'No perteneces a ningún grupo.' : ''}
                </p>
              )
            )}
            {userMemberships.length === 0 && (
              <p className="text-center text-gray-300 mt-4">No perteneces a ningún grupo.</p>
            )}
          </div>
        </div>
      </div>

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default Profile_Board;