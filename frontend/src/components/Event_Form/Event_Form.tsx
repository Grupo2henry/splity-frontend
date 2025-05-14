/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IFormEvent, UserSuggestion, User } from "./types";
import { fetchUsersByEmail } from "@/services/fetchUsersByEmail";
import { useGroup } from "@/context/GroupContext";
import { useAuth } from "@/context/AuthContext"; // Importa useAuth
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export const Event_Form = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormEvent>({ mode: "onBlur" });
  const { createGroup } = useGroup();
  const { user } = useAuth(); // Usa el hook useAuth para obtener el usuario

  const [emailSearch, setEmailSearch] = useState<string>("");
  const [emailSuggestions, setEmailSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<UserSuggestion[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    // Add the logged-in user as the first participant by default
    if (user?.id && !selectedParticipants.some(p => p.id === user.id)) {
      setSelectedParticipants([{ id: user.id, name: user.name, email: user.email }]);
    }
  }, [user?.id, user?.name, user?.email, selectedParticipants]);

  useEffect(() => {
    const participantIds = selectedParticipants.map(participant => participant.id);
    setValue("participants", participantIds);
  }, [selectedParticipants, setValue]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (emailSearch.length >= 2) {
        try {
          const results: User[] = await fetchUsersByEmail(emailSearch);
          const filteredResults = results.filter((u: User) => u.id !== user?.id);
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
  }, [emailSearch]);

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
    // Include the logged-in user's ID in the participants array if not already present
    const participantsToSend = [...new Set([...data.participants, user?.id].filter(Boolean) as string[])];
    const groupDataToSend = { ...data, emoji, participants: participantsToSend };
    createGroup(groupDataToSend);
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
                onClick={() => handleRemoveParticipant(index + (user?.id ? 1 : 0))} // Adjust index
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

      <div className="flex flex-col items-center justify-center">
        <button type="submit" className="btn-yellow text-[16px] mt-8">Crear Evento</button>
      </div>
    </form>
  );
};

export default Event_Form;