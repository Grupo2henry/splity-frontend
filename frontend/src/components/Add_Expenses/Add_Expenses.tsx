"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { useState, useEffect } from "react";
import fetchGetGroup from "@/services/fetchGetGroup";
import { group, member, IFormGasto } from "./types";
import fetchCreateExpense from "@/services/fetchCreateExpense";

export const Add_Expenses = ({slugNumber} : {slugNumber: number}) => {
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormGasto>({ mode: "onBlur" });
  const [group, setGroup] = useState<group | null>(null);
  setValue("imgUrl", "/image1.svg");  

  useEffect(() => {
    const getGroup = async () => {
      try {
        const response = await fetchGetGroup(slugNumber);
        setGroup(response);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };

    if (slugNumber) getGroup();
  }, [slugNumber]);

  const onSubmit: SubmitHandler<IFormGasto> = async (data) => {
    try {
      await fetchCreateExpense(data, slugNumber);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4">
      {/* Titulo del gasto */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Título del gasto</label>
        <div className="flex flex-row rounded-lg bg-[#61587C] gap-2 p-2">
          <Image src="/image1.svg" alt="Logo" width={77} height={77} />
          <div className="flex flex-col w-full gap-2">
            <input
              {...register("description", { required: "Este campo es obligatorio" })}
              type="text"
              placeholder="Ej: Almuerzo, Taxi, Regalo..."
              className="custom-input h-10"
            />
            {errors.description && <p className="text-amber-50 text-[0.75rem]">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Importe */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Importe</label>
        <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
          <input
            {...register("amount", { required: "Este campo es obligatorio", valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="Ej: 150.00"
            className="custom-input"
          />
          {errors.amount && <p className="text-amber-50 text-[0.75rem]">{errors.amount.message}</p>}
        </div>
      </div>

      {/* Pagado por */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">¿Quién lo pagó?</label>
        <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
            <select {...register("paid_by", /*{ required: "Este campo es obligatorio" }*/)} className="custom-input">
            <option value="">-- Selecciona un participante --</option>
            {group && group.memberships.map((member: member, index: number) => (
                <option key={index} value={member.user.id}>{member.user.name}</option>
            ))}
            </select>
            {errors.paid_by && <p className="text-amber-50 text-[0.75rem]">{errors.paid_by.message}</p>}
        </div>
      </div>
      {/* Fecha del gasto */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Fecha del gasto</label>
        <div className="flex flex-col rounded-lg bg-[#61587C] gap-2 p-2">
          <input
            {...register("date", { required: "Este campo es obligatorio" })}
            type="date"
            className="custom-input"
          />
          {errors.date && <p className="text-amber-50 text-[0.75rem]">{errors.date.message}</p>}
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex flex-col items-center justify-center">
        <button type="submit" className="btn-yellow text-[16px] mt-8">Añadir Gasto</button>
      </div>
    </form>
  );
};

export default Add_Expenses;
