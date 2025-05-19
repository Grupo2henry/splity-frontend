'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCustomAlert } from '@/components/CustomAlert/CustomAlert';
import updateUserProfile from '@/services/auth-services/updateUserProfile';
import Image from 'next/image'; // Import the Image component

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditForm = ({ onCancel, onSave }: ProfileEditFormProps) => {
  const { user, token, updateUser } = useAuth();
  const { showAlert } = useCustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profile_picture_url: user?.profile_picture_url || ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.profile_picture_url || '');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token || !user?.id) {
        throw new Error('No authentication token or user ID available');
      }

      const updatedUser = await updateUserProfile(formData, token, user.id);
      updateUser(updatedUser); // Update the user context with new data
      showAlert('Perfil actualizado correctamente');
      onSave();
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !token || !user?.id) return;
    const formData = new FormData();
    formData.append('image', selectedImage);
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/profile-Image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen');
      }
      const data = await response.json();
      setImagePreview(data.profile_picture_url);
      updateUser({ ...user, profile_picture_url: data.profile_picture_url });
      showAlert('Imagen de perfil actualizada');
      setSelectedImage(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
    } catch (error) {
      showAlert(error instanceof Error ? error.message : 'Error al subir la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={imagePreview || '/default-avatar.svg'}
          alt="Imagen de perfil"
          width={96} // Adjust as needed
          height={96} // Adjust as needed
          className="rounded-full object-cover border border-gray-200 mb-2"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleImageUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !selectedImage}
        >
          {isLoading ? 'Subiendo...' : 'Actualizar imagen'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Tu nombre"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="tu@email.com"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;