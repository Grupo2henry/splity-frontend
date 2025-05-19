'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import CustomAlert, { useCustomAlert } from '@/components/CustomAlert/CustomAlert';

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditForm = ({ onCancel, onSave }: ProfileEditFormProps) => {
  const { user } = useAuth();
  const { showAlert } = useCustomAlert();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile_picture_url: user?.profile_picture_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the actual update logic here
    showAlert('Perfil actualizado correctamente');
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#61587C] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#61587C] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          URL de la imagen de perfil
        </label>
        <input
          type="url"
          name="profile_picture_url"
          value={formData.profile_picture_url}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#61587C] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm; 