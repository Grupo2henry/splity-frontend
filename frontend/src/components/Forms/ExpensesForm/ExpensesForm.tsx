/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { useEffect, useCallback, useState, useRef } from "react";
import { useExpenses } from "@/context/ExpensesContext";
import { useMembership } from "@/context/MembershipContext";
import { IFormGasto } from "./types";
import { useParams, usePathname } from "next/navigation";
import styles from "./ExpensesForm.module.css";

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

  const { slug } = useParams();
  const pathname = usePathname();

  const isUpdatePage = pathname.includes("Update_Spent");
  const expenseId = isUpdatePage && typeof slug === "string" ? slug : undefined;

  const uploadImage = async (expenseId: string): Promise<string | null> => {
    if (!selectedFile) return null;
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error uploading image');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Error uploading image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const memoizedGetExpenseById = useCallback(
    async (id: string) => {
      try {
        return await getExpenseById(id);
      } catch (error) {
        console.error("Error al obtener el gasto:", error);
        return null;
      }
    },
    [getExpenseById]
  );

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
    if (!actualGroupMembership?.group.id) return;
    
    try {
      if (isUpdatePage && expenseId) {
        // Handle update case
        if (selectedFile) {
          // If there's a new image, upload it first
          const imageUrl = await uploadImage(expenseId);
          if (imageUrl) {
            data.imgUrl = imageUrl;
          }
        }
        await updateExpense(data, expenseId, actualGroupMembership.group.id.toString());
      } else {
        // Handle create case
        const createdExpense = await createExpense(data, actualGroupMembership.group.id.toString());
        if (selectedFile && createdExpense?.id) {
          const imageUrl = await uploadImage(createdExpense.id.toString());
          if (imageUrl) {
            await updateExpense(
              { ...data, imgUrl: imageUrl },
              createdExpense.id.toString(),
              actualGroupMembership.group.id.toString()
            );
          }
        }
      }
    } catch (error) {
      console.error('Error handling expense:', error);
      setUploadError(error instanceof Error ? error.message : 'Error processing expense');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Título del gasto</label>
        <div className={styles.inputContainer}>
          <div
            className={styles.uploadBox}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className={styles.uploadText}>
                Imagen seleccionada
              </div>
            ) : (
              <>
                <span className={styles.uploadIcon}>$</span>
                <span className={styles.uploadText}>
                  Click para agregar comprobante
                </span>
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
              className={styles.input}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Importe</label>
        <div className={styles.inputContainer}>
          <input
            {...register("amount", { required: "Este campo es obligatorio", valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="Ej: 150.00"
            className={styles.input}
          />
        </div>
        {errors.amount && (
          <p className={styles.error}>{errors.amount.message}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>¿Quién lo pagó?</label>
        <div className={styles.inputContainer}>
          <select
            {...register("paid_by")}
            className={styles.select}
            disabled={loadingParticipants || loadingExpenseContext}
          >
            <option value="">-- Selecciona un participante --</option>
            {participants &&
              participants.map((participant) => (
                <option key={participant.user.id} value={participant.user.id}>
                  {participant.user.name}
                </option>
              ))}
          </select>
        </div>
        {errors.paid_by && (
          <p className={styles.error}>{errors.paid_by.message}</p>
        )}
        {loadingParticipants && (
          <p className={styles.error}>Cargando participantes...</p>
        )}
        {participantsErrors.length > 0 && (
          <p className={styles.error}>{participantsErrors[0]}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Fecha del gasto</label>
        <div className={styles.inputContainer}>
          <input
            {...register("date", { required: "Este campo es obligatorio" })}
            type="date"
            className={styles.input}
          />
        </div>
        {errors.date && (
          <p className={styles.error}>{errors.date.message}</p>
        )}
      </div>

      {(expenseErrors.length > 0 || uploadError) && (
        <div className={styles.errorContainer}>
          {expenseErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
          {uploadError && <p>{uploadError}</p>}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loadingParticipants || loadingExpenseContext || isUploading}
      >
        {isUpdatePage ? "Guardar Cambios" : "Añadir Gasto"}
      </button>
    </form>
  );
};

export default ExpensesForm;
