"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormResetPassword } from "./types";
import { fetchResetPassword } from "@/services/auth-services/fetchResetPassword";
import CustomAlert, { useCustomAlert } from "@/components/CustomAlert/CustomAlert";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.css";
import { EyeIcon } from '@/components/Icons/EyeIcon';
import { useState } from "react";

export const ResetPasswordForm = () => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<IFormResetPassword>({ mode: "onBlur" });
    const { message, showAlert, onClose } = useCustomAlert();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const onSubmit: SubmitHandler<IFormResetPassword> = async (data) => {
        try {
            await fetchResetPassword(data);
            showAlert("La contraseña ha sido restablecida con éxito", "/Login");
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message);
            } else {
                showAlert("Error desconocido");
            }
        }
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
                    <h1 className={styles.title}>Restablecer Contraseña</h1>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register("email", {
                                    required: "El correo electrónico es obligatorio",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "El formato del correo electrónico no es válido"
                                    }
                                })}
                                type="email"
                                placeholder="Correo Electrónico"
                                className={styles.input}
                            />
                            {errors.email && (
                                <p className={styles.errorMessage}>{errors.email.message}</p>
                            )}
                        </div>

                        <div className={styles.inputWrapper}>
                            <input
                                {...register("newPassword", {
                                    required: "La contraseña es obligatoria",
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                                        message: "La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial",
                                    },
                                })}
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Nueva Contraseña"
                                className={styles.input}
                            />
                            <button
                                type="button"
                                className={styles.toggleButton}
                                onClick={togglePasswordVisibility}
                                aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <EyeIcon visible={passwordVisible} />
                            </button>
                            {errors.newPassword && (
                                <p className={styles.errorMessage}>{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div className={styles.inputWrapper}>
                            <input
                                {...register("confirmNewPassword", {
                                    required: "La confirmación de la contraseña es obligatoria",
                                    validate: (value) => value === getValues("newPassword") || "Las contraseñas no coinciden"
                                })}
                                type={confirmPasswordVisible ? "text" : "password"}
                                placeholder="Confirmar Nueva Contraseña"
                                className={styles.input}
                            />
                            <button
                                type="button"
                                className={styles.toggleButton}
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label={confirmPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                <EyeIcon visible={confirmPasswordVisible} />
                            </button>
                            {errors.confirmNewPassword && (
                                <p className={styles.errorMessage}>{errors.confirmNewPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Restablecer Contraseña
                    </button>

                    <Link href="/Login" className={styles.backToLogin}>
                        Volver al inicio de sesión
                    </Link>
                </form>
            </div>
            <CustomAlert message={message} onClose={onClose} />
        </>
    );
};

export default ResetPasswordForm;