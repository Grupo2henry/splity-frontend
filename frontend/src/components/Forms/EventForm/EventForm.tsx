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
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const [locationName, setLocationName] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (slug && actualGroupMembership?.group) {
      setIsUpdate(true);
      const { name, emoji: groupEmoji, latitude, longitude } = actualGroupMembership.group;

      reset({ name, emoji: groupEmoji || "", participants: [] });
      setEmoji(groupEmoji || "");
      setValue("emoji", groupEmoji || "");
      setLocation(latitude && longitude ? { lat: latitude, lng: longitude } : null);
      setLocationName(name);

      const initialParticipants = participants
        .filter(member => member.user.id !== user?.id)
        .map(member => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
        }));

      setSelectedParticipants([
        ...(user ? [{ id: user.id, name: user.name, email: user.email }] : []),
        ...initialParticipants
      ]);
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
    const participantsToSend = [...new Set([...data.participants, user?.id].filter(Boolean) as string[])];

    const groupDataToSend = {
      name: data.name,
      emoji,
      participants: participantsToSend,
      locationName: locationName || data.name,
      latitude: location?.lat,
      longitude: location?.lng,
    };

    if (isUpdate && slug) {
      await updateGroup(slug, groupDataToSend);
      if (!updateGroupErrors.length && !updatingGroup) {
        router.push(`/Event_Details/${slug}`);
      }
    } else {
      await createGroup(groupDataToSend);
      if (!groupErrors.length) {
        router.push('/');
      }
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Titulo del evento</label>
        <div className="flex flex-row rounded-lg bg-[#61587C] gap-2 p-2">
          <Image src="/image1.svg" alt="Logo" width={77} height={77} />
          <div className="flex flex-col w-full gap-2">
            <input {...register("name", { required: "Este campo es obligatorio" })} type="text" placeholder="Cena, Salida, Viaje, etc..." className="custom-input h-10" />
            {errors.name && <p className="text-amber-50 text-[0.75rem]">{errors.name.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Emoji del evento</label>
        <div className="relative rounded-lg bg-[#61587C] p-2">
          <input {...register("emoji")} type="text" value={emoji} placeholder="Selecciona un emoji" className="custom-input h-10" readOnly onClick={toggleEmojiPicker} />
          <button type="button" onClick={toggleEmojiPicker} className="absolute top-2 right-2 text-white">
            {emoji || "😊"}
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 z-10 bg-white rounded shadow-md">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Participantes</label>
        <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
          <input type="text" defaultValue={user?.name} className="custom-input" readOnly />
          {selectedParticipants.filter(p => p.id !== user?.id).map((participant, index) => (
            <div key={participant.id} className="flex flex-row items-center gap-2">
              <input
                type="text"
                className="custom-input"
                readOnly
                value={participant.name} // Mostrar el nombre en el input
              />
              <button
                type="button"
                onClick={() => handleRemoveParticipant(index)}
                className="p-1 rounded-full bg-red-500 text-white text-xs focus:outline-none"
              >
                X
              </button>
            </div>
          ))}
          <input
            type="text"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="Buscar por email..."
            className="custom-input"
          />
          {emailSuggestions.length > 0 && (
            <ul className="bg-white rounded shadow text-black max-h-40 overflow-y-auto">
              {emailSuggestions.map((suggestedUser) => (
                <li
                  key={suggestedUser.id}
                  onClick={() => handleSelectEmail(suggestedUser)}
                  className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {suggestedUser.name} ({suggestedUser.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(groupErrors.length > 0 || updateGroupErrors.length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          {(groupErrors.length > 0 ? groupErrors : updateGroupErrors).map((error, index) => (
            <p key={index} className="text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Ubicación del evento</label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Nombre de la ubicación"
          className="custom-input"
        />

        <div className="w-full h-[300px] rounded-lg overflow-hidden">
          <MapSelector onSelectLocation={setLocation} initialLocation={location} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <button type="submit" className="btn-yellow text-[16px] mt-8" disabled={updatingGroup}>
          {isUpdate ? (updatingGroup ? "Actualizando Evento..." : "Actualizar Evento") : "Crear Evento"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;