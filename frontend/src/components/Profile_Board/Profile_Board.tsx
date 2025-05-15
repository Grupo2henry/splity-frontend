'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import fetchSpecificUserDetails from '@/services/fetchSpecificUserDetails';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import fetchGetMyGroups from '@/services/fetchGetMyGroups';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  created_at: string;
  active: boolean;
  profile_picture_url?: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  created_at: string;
  role: 'ADMIN' | 'MEMBER';
}

interface Props {
  userId: string;
}

const Profile_Board = ({ userId }: Props) => {
  const { message, showAlert, onClose } = useCustomAlert();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResult, groupsResult] = await Promise.all([
          fetchSpecificUserDetails(userId),
          fetchGetMyGroups()
        ]);

        if (!userResult) {
          showAlert('No se pudieron obtener los datos del perfil.');
        } else {
          setUserDetails(userResult);
        }

        if (groupsResult) {
          setUserGroups(groupsResult);
        }
      } catch (error) {
        console.error('Error al obtener datos del perfil:', error);
        showAlert('Error al obtener los datos del perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-white text-center mt-10">Cargando perfil...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#61587C] rounded-lg text-white">
      <div className="w-full max-w-2xl">
        {userDetails ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-[#4B4362] p-4 rounded-lg">
  <div className="flex items-center gap-4">
    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#61587C] flex items-center justify-center">
      <Image
        src={userDetails.profile_picture_url || '/default-avatar.svg'}
        alt="Profile"
        width={52}
        height={52}
        className="object-cover w-full h-full"
      />
    </div>
    <div>
      <h2 className="text-xl font-bold">{userDetails.name}</h2>
      <p className="text-gray-300 text-sm">{userDetails.email}</p>
    </div>
  </div>
  {userDetails.active && (
    <span className="bg-green-500 px-3 py-1 rounded-full text-xs">
      Activo
    </span>
  )}
</div>

            <div className="bg-[#4B4362] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Información de la cuenta</h3>
              <div className="space-y-4">
                {/* <div>
                  <label className="text-gray-300 text-sm block">ID de Usuario</label>
                  <p className="font-medium">{userDetails.id}</p>
                </div> */}
                <div>
                  <label className="text-gray-300 text-sm block">Miembro desde</label>
                  <p className="font-medium">
                    {new Date(userDetails.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-gray-300 text-sm block">Estado de la cuenta</label>
                  <p className="font-medium">
                    {userDetails.active ? 'Cuenta activa' : 'Cuenta inactiva'}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="bg-[#4B4362] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Grupos</h3>
              {userGroups.length > 0 ? (
                <div className="space-y-3">
                  {userGroups.map((group) => (
                    <div key={group.id} className="bg-[#61587C] p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{group.name}</h4>
                          <p className="text-sm text-gray-300">{group.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          group.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {group.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2">
                        Creado el {new Date(group.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-300">No perteneces a ningún grupo.</p>
              )}
            </div> */}
          </div>
        ) : (
          <div className="text-center p-4 bg-[#4B4362] rounded-lg">
            <p>No se encontraron datos del perfil.</p>
          </div>
        )}
      </div>

      <CustomAlert message={message} onClose={onClose} />
    </div>
  );
};

export default Profile_Board;