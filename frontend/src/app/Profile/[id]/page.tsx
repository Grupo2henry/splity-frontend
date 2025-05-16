'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import ProfileBoard from '@/components/Profile_Board/Profile_Board';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastViewedProfile', id);
    }
  }, [id]);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold text-white mb-4">Perfil de Usuario</h1> */}
      <ProfileBoard />
    </div>
  );
};

export default ProfilePage; 