/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { useEffect, useCallback, useState, useRef } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { useMembership } from "@/context/MembershipContext";
import { IFormGasto } from "./types";
import { useParams, usePathname } from "next/navigation";

export const ExpensesForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IFormGasto>({ mode: "onBlur" });

  const {
    createExpense,
    expenseErrors,
    getExpenseById,
    updateExpense,
    loadingExpenses: loadingExpenseContext,
  } = useExpenses();

  const {
    participants,
    loadingParticipants,
    participantsErrors,
    actualGroupMembership,
  } = useMembership();

  console.log("Participantes: ", participants)
  console.log("Membresia: ", actualGroupMembership);
  const { slug } = useParams();
  const pathname = usePathname();

  const isUpdatePage = pathname.includes("Update_Spent");
  const expenseId = isUpdatePage && typeof slug === "string" ? slug : undefined;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const uploadImage = async (expenseId: string) => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it automatically with boundary for multipart/form-data
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Error al subir la imagen');
      }
      
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      setUploadError('Error al subir la imagen. Por favor, intente nuevamente.');
      console.error('Error al subir imagen:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ useCallback para evitar cambios de referencia
  const memoizedGetExpenseById = useCallback(getExpenseById, []);

  // ✅ Carga datos si es edición
  useEffect(() => {
    const loadExpenseData = async () => {
      if (isUpdatePage && expenseId) {
        const expenseData = await memoizedGetExpenseById(expenseId);
        if (expenseData) {
          reset({
            description: expenseData.description,
            amount: expenseData.amount,
            paid_by: expenseData.paid_by?.id,
            date: expenseData.date.substring(0, 10),
            imgUrl: expenseData.imgUrl || "",
          });
        }
      } else {
        reset({
          description: "",
          amount: undefined,
          paid_by: "",
          date: "",
          imgUrl: "",
        });
      }
    };

    loadExpenseData();
  }, [expenseId, isUpdatePage, memoizedGetExpenseById, reset]);

  const onSubmit: SubmitHandler<IFormGasto> = async (data) => {
    if (actualGroupMembership?.group.id) {
      try {
        let createdExpense;
        if (isUpdatePage && expenseId) {
          createdExpense = await updateExpense(data, expenseId, actualGroupMembership.group.id.toString());
        } else {
          createdExpense = await createExpense(data, actualGroupMembership.group.id.toString());
        }

        // If we have a file to upload and the expense was created/updated successfully
        if (selectedFile && createdExpense?.id) {
          const imageUrl = await uploadImage(createdExpense.id.toString());
          if (imageUrl) {
            // Update the expense with the new image URL
            await updateExpense(
              { ...data, imgUrl: imageUrl },
              createdExpense.id.toString(),
              actualGroupMembership.group.id.toString()
            );
          }
        }
      } catch (error) {
        console.error('Error handling expense:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full gap-4">
      {/* Título del gasto */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[16px] text-start text-[#FFFFFF]">Título del gasto</label>
        <div className="flex flex-row rounded-lg bg-[#61587C] gap-2 p-2">
          <div className="relative w-[77px] h-[77px] bg-[#4A4458] rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-[#5A5468] transition-colors"
               onClick={() => fileInputRef.current?.click()}>
            {selectedFile ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#FFFFFF] text-sm text-center px-1">Imagen seleccionada</span>
              </div>
            ) : (
              <>
                <span className="text-[#FFFFFF] text-2xl">$</span>
                <span className="text-[#FFFFFF] text-[10px] text-center mt-1">Click para agregar comprobante</span>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
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
          <select {...register("paid_by")} className="custom-input" disabled={loadingParticipants || loadingExpenseContext}>
            <option value="">-- Selecciona un participante --</option>
            {participants &&
              participants.map((participant) => (
                <option key={participant.user.id} value={participant.user.id}>
                  {participant.user.name}
                </option>
              ))}
          </select>
          {errors.paid_by && <p className="text-amber-50 text-[0.75rem]">{errors.paid_by.message}</p>}
          {loadingParticipants && <p className="text-gray-400 text-sm">Cargando participantes...</p>}
          {participantsErrors.length > 0 && <p className="text-red-500 text-sm">{participantsErrors[0]}</p>}
        </div>
      </div>

      {/* Fecha */}
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

      {/* Errores del contexto */}
      {(expenseErrors.length > 0 || uploadError) && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm">
          {expenseErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
          {uploadError && <p>{uploadError}</p>}
        </div>
      )}

      {/* Botón */}
      <div className="flex flex-col items-center justify-center">
        <button 
          type="submit" 
          className="btn-yellow text-[16px] mt-8" 
          disabled={loadingParticipants || loadingExpenseContext || isUploading}
        >
          {isUpdatePage ? "Guardar Cambios" : "Añadir Gasto"}
        </button>
      </div>
    </form>
  );
};

export default ExpensesForm;
