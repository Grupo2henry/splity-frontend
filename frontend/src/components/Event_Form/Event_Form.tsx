"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IFormEvent, UserSuggestion } from "./types";
import { fetchUsersByEmail } from "@/services/fetchUsersByEmail";
import { fetchCreateGroup } from "@/services/fetchCreateGroup";
import { useAuth } from "@/context/AuthContext";

export const Event_Form = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormEvent>({ mode: "onBlur" });

  const { user } = useAuth();
  const [emailSearch, setEmailSearch] = useState<string>("");
  const [emailSuggestions, setEmailSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<UserSuggestion[]>([]);

  useEffect(() => {
    setValue("creatorId", user?.id || "");
  }, [user, setValue]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (emailSearch.length >= 2) {
        try {
          const results = await fetchUsersByEmail(emailSearch);
          setEmailSuggestions(results.slice(0, 5));
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

  const handleSelectEmail = (user: UserSuggestion) => {
    setSelectedParticipants(prev => [...prev, user]);
    setEmailSearch("");
    setEmailSuggestions([]);
  };

  useEffect(() => {
    const participantIds = selectedParticipants.map(participant => participant.id);
    setValue("participants", participantIds);
  }, [selectedParticipants, setValue]);

  const handleRemoveParticipant = (indexToRemove: number) => {
    setSelectedParticipants(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit: SubmitHandler<IFormEvent> = async (data) => {
    try {
      const token = localStorage.getItem("token") || "";
      await fetchCreateGroup(data, token);
      // Considerar mostrar un mensaje de éxito o redirigir
    } catch (error) {
      console.error(error);
      // Considerar mostrar un mensaje de error al usuario
    }
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
        <label className="text-[16px] text-start text-[#FFFFFF]">Participantes</label>
        <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
          <input type="text" defaultValue={user?.name} className="custom-input" readOnly />
          {selectedParticipants.map((participant, index) => (
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
              {emailSuggestions.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectEmail(user)}
                  className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {user.name} ({user.email})
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