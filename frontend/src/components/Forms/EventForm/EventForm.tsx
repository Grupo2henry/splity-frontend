/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IFormEvent, UserSuggestion, User } from "./types";
import { fetchUsersByEmail } from "@/services/auth-services/fetchUsersByEmail";
import { useGroup } from "@/context/GroupContext";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import dynamic from "next/dynamic";
import { LatLngLiteral } from "leaflet";
import { useRouter } from "next/navigation";
import styles from "./EventForm.module.css";

// Importación dinámica del MapSelector
const MapSelector = dynamic(() => import("../../MapSelector/GoogleMapSelector"), { ssr: false });

interface EventFormProps {
  slug?: string;
}

export const EventForm: React.FC<EventFormProps> = ({ slug }) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<IFormEvent>({ mode: "onBlur" });
  const { createGroup, groupErrors } = useGroup();
  const { participants, updateGroup, updatingGroup, updateGroupErrors, actualGroupMembership } = useMembership();
  const { user } = useAuth();
  const router = useRouter();

  const [emailSearch, setEmailSearch] = useState<string>("");
  const [emailSuggestions, setEmailSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<UserSuggestion[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState("");
  // `location` y `locationName` se siguen manejando aquí, pero `locationName` se actualiza desde MapSelector
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const [locationName, setLocationName] = useState(""); // Este estado ahora será actualizado por MapSelector
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (slug && actualGroupMembership?.group) {
      setIsUpdate(true);
      const { name, emoji: groupEmoji, latitude, longitude, locationName: groupLocationName } = actualGroupMembership.group;

      reset({ name, emoji: groupEmoji || "", participants: [] });
      setEmoji(groupEmoji || "");
      setValue("emoji", groupEmoji || "");

      if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
        setLocation({ lat: latitude, lng: longitude });
      } else {
        setLocation(null);
      }
      // Establecer el nombre de la ubicación para que se refleje en el Autocomplete del MapSelector
      setLocationName(groupLocationName || name); // Se propaga a MapSelector para inicializar su input
    } else if (!slug && user) {
      setIsUpdate(false);
      reset({ name: "", emoji: "", participants: [] });
      setEmoji("");
      setLocation(null);
      setLocationName("");
      setSelectedParticipants([{ id: user.id, name: user.name, email: user.email }]);
    }
  }, [slug, user?.id, actualGroupMembership, participants, reset, setValue]);

  useEffect(() => {
    const participantIds = selectedParticipants.map(participant => participant.id);
    setValue("participants", participantIds);
  }, [selectedParticipants, setValue]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (emailSearch.length >= 2) {
        try {
          const results: User[] = await fetchUsersByEmail(emailSearch);
          const filteredResults = results.filter((u: User) =>
            u.id !== user?.id && !selectedParticipants.some(p => p.id === u.id)
          );
          setEmailSuggestions(filteredResults.slice(0, 5));
        } catch (error) {
          console.error(error);
          setEmailSuggestions([]);
        }
      } else {
        setEmailSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [emailSearch, user?.id, selectedParticipants]);

  const handleSelectEmail = (suggestedUser: UserSuggestion) => {
    if (!selectedParticipants.some(p => p.id === suggestedUser.id)) {
      setSelectedParticipants(prev => [...prev, suggestedUser]);
    }
    setEmailSearch("");
    setEmailSuggestions([]);
  };

  const handleRemoveParticipant = (indexToRemove: number) => {
    setSelectedParticipants(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit: SubmitHandler<IFormEvent> = async (data) => {
    setIsCreating(true);
    const participantsToSend = [...new Set([...data.participants, user?.id].filter(Boolean) as string[])];

    const groupDataToSend = {
      name: data.name,
      emoji,
      participants: participantsToSend,
      locationName: locationName || data.name, // Usar `locationName` del estado, que ahora viene del MapSelector
      latitude: location?.lat,
      longitude: location?.lng,
    };

    try {
      if (isUpdate && slug) {
        await updateGroup(slug, groupDataToSend);
        if (!updateGroupErrors.length && !updatingGroup) {
          router.push(`/Event_Details/${slug}`);
        }
      } else {
        await createGroup(groupDataToSend);
        if (!groupErrors.length) {
          router.push('/Dashboard');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEmojiSelect = (emojiObject: any) => {
    setEmoji(emojiObject.native);
    setValue("emoji", emojiObject.native);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h1 className={styles.title}>{isUpdate ? "Actualizar Evento" : "Crear Nuevo Evento"}</h1>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Titulo del evento</label>
        <div className={styles.inputWrapper}>
          <div className={styles.eventIcon}>
            <Image src="/image1.svg" alt="Logo" width={77} height={77} />
          </div>
          <div className="flex flex-col w-full">
            <input
              {...register("name", { required: "Este campo es obligatorio" })}
              type="text"
              placeholder="Cena, Salida, Viaje, etc..."
              className={styles.input}
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Emoji del evento</label>
        <div className={styles.inputWrapper} style={{ position: 'relative' }}>
          <input
            {...register("emoji")}
            type="text"
            value={emoji}
            placeholder="Selecciona un emoji"
            className={styles.input}
            readOnly
            onClick={toggleEmojiPicker}
          />
          <button
            type="button"
            className={styles.emojiButton}
            onClick={toggleEmojiPicker}
          >
            {emoji || "😊"}
          </button>
          {showEmojiPicker && (
            <div className={styles.emojiPickerWrapper}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Participantes</label>
        <div className={styles.inputWrapper}>
          <div className={styles.participantsList}>
            <input
              type="text"
              defaultValue={user?.name}
              className={styles.input}
              readOnly
            />
            {selectedParticipants.filter(p => p.id !== user?.id).map((participant, index) => (
              <div key={participant.id} className={styles.participantItem}>
                <input
                  type="text"
                  className={styles.input}
                  readOnly
                  value={participant.name}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(index)}
                  className={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              placeholder="Buscar por email..."
              className={styles.input}
            />
            {emailSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {emailSuggestions.map((suggestedUser) => (
                  <li
                    key={suggestedUser.id}
                    onClick={() => handleSelectEmail(suggestedUser)}
                    className={styles.suggestionItem}
                  >
                    {suggestedUser.name} ({suggestedUser.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {(groupErrors.length > 0 || updateGroupErrors.length > 0) && (
        <div className={styles.errorContainer}>
          {(groupErrors.length > 0 ? groupErrors : updateGroupErrors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {/* Aquí unificamos los campos de ubicación */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Ubicación del evento</label>
        <div className={styles.mapContainer}>
          {/* MapSelector ahora maneja tanto el input de búsqueda como el mapa */}
          <MapSelector
            location={location}
            onLocationChange={(latLng, name) => {
              setLocation(latLng);
              // Aquí es donde el nombre de la ubicación se actualiza
              // desde el MapSelector y se guarda en el estado local de EventForm
              if (name) {
                setLocationName(name);
              } else if (latLng) {
                // Si no viene nombre (ej. por clic en el mapa), podrías
                // decidir qué hacer, por ejemplo, limpiar el nombre o intentar un reverse geocode
                setLocationName(""); // Limpiar si se selecciona por clic y no hay nombre inmediato
              }
            }}
            // Prop para inicializar el valor del input de búsqueda en MapSelector
            initialLocationName={locationName}
          />
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={updatingGroup || isCreating}
      >
        {isUpdate
          ? (updatingGroup ? "Actualizando Evento..." : "Actualizar Evento")
          : (isCreating ? "Creando Evento..." : "Crear Evento")}
      </button>
    </form>
  );
};

export default EventForm;