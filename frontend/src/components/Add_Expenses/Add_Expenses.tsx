"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { useEffect } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { useGroup } from "@/context/GroupContext";
import { useMembership } from "@/context/MembershipContext"; // Importa el MembershipContext
import { IFormGasto } from "./types";

export const Add_Expenses = ({ slugNumber }: { slugNumber: number }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IFormGasto>({ mode: "onBlur" });
  const { createExpense, expenseErrors } = useExpenses();
  const { actualGroup } = useGroup();
  const { participants, loadingParticipants, participantsErrors } = useMembership(); // Obtén participants del contexto

  setValue("imgUrl", "/image1.svg");
  console.log(slugNumber)
  useEffect(() => {
    // El MembershipContext ya se encarga de cargar los participantes cuando actualGroup cambia
    // No necesitamos fetchGetGroup aquí
  }, [actualGroup]);

  const onSubmit: SubmitHandler<IFormGasto> = async (data) => {
    if (actualGroup?.id) {
      await createExpense(data, actualGroup.id.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4">
      {/* Título del gasto */}
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
          <select {...register("paid_by")} className="custom-input" disabled={loadingParticipants}>
            <option value="">-- Selecciona un participante --</option>
            {participants && participants.map((participant) => (
              <option key={participant.user.id} value={participant.user.id}>{participant.user.name}</option>
            ))}
          </select>
          {errors.paid_by && <p className="text-amber-50 text-[0.75rem]">{errors.paid_by.message}</p>}
          {loadingParticipants && <p className="text-gray-400 text-sm">Cargando participantes...</p>}
          {participantsErrors.length > 0 && (
            <p className="text-red-500 text-sm">{participantsErrors[0]}</p>
          )}
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

      {/* Mostrar errores desde el contexto de gastos */}
      {expenseErrors.length > 0 && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm">
          {expenseErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}

      {/* Botón de envío */}
      <div className="flex flex-col items-center justify-center">
        <button type="submit" className="btn-yellow text-[16px] mt-8" disabled={loadingParticipants}>
          Añadir Gasto
        </button>
      </div>
    </form>
  );
};

export default Add_Expenses;