"use client";

import {useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { IFormEvent } from "./types";

export const Event_Form = () => {
    const createrName = "Nicolas Allende";
    const { register, handleSubmit, formState: { errors } } = useForm<IFormEvent>({mode: "onBlur"});
    const [inputParticipants, setInputParticipants] = useState<string[]>([]);

    const addInput = () => { 
        setInputParticipants((prev) => [...prev,""]);
    };

    const onSubmit: SubmitHandler<IFormEvent> = async (data) => {
            try {
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4">
            <div className="flex flex-col w-full gap-2">
                <label className="text-[16px] text-start text-[#FFFFFF]">Titulo del evento</label>
                <div className="flex flex-row rounded-lg bg-[#61587C] gap-2 p-2">
                    <Image src="/image1.svg" alt="Logo" width={77} height={77}/>
                    <div className="flex flex-col w-full gap-2">                
                        <input {...register("eventName", { required: "Este campo es obligatorio" })} type="text" placeholder="Cena, Salida, Viaje, etc..." className="custom-input h-10"/>
                        {errors.eventName && <p className="text-amber-50 text-[0.75rem]">{errors.eventName.message}</p>}
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
                <label className="text-[16px] text-start text-[#FFFFFF]">Moneda</label>
                <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
                    <select {...register("currency")} id="moneda" name="moneda" className="custom-input">
                        <option value="">-- Selecciona una opción --</option>
                        <option value="Pesos Argentinos">Pesos Argentinos</option>
                        <option value="Dolares Estadounidenses">Dolares Estadounidenses</option>
                        <option value="Euros">Euros</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col w-full gap-2">
                <label className="text-[16px] text-start text-[#FFFFFF]">Participantes</label>
                <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
                    <input {...register("createrName")} type="text" defaultValue={createrName} className="custom-input" readOnly/>
                    {inputParticipants.map((valor,index) => (
                    <div key={index}>
                        <input {...register(`participants.${index}`, { required: "Este campo es obligatorio" })} type="text" placeholder="Nombre del participante" className="custom-input" />
                        {errors.participants?.[index] && <p className="text-amber-50 text-[0.75rem]">{errors.participants[index]?.message}</p>}
                    </div>
                    ))}
                    <button onClick={addInput} className="text-[#FAFF00] text-start">Agregar Participante</button>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                    <button type="submit" className="btn-yellow text-[16px] mt-8">Crear Evento</button>                    
            </div>
        </form>
    );
};

export default Event_Form;