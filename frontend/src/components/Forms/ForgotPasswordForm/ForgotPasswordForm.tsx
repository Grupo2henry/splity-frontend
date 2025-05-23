"use client";

import {useForm, SubmitHandler} from "react-hook-form";
import {IFormForgotPassword} from "./types";
import { fetchForgotPassword } from "@/services/auth-services/fetchForgotPassword";
import CustomAlert, { useCustomAlert } from "@/components/CustomAlert/CustomAlert";
import Link from "next/link";
import styles from "./ForgotPasswordForm.module.css";

export const ForgotPasswordForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<IFormForgotPassword>({mode: "onBlur"});

    const { message, showAlert, onClose } = useCustomAlert();

    const onSubmit: SubmitHandler<IFormForgotPassword> = async (data) => {
        try {
            await fetchForgotPassword(data);
            showAlert("Se ha enviado un correo electrónico para restablecer la contraseña.", "/Login");
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
                    <h1 className={styles.title}>Recuperar Contraseña</h1>
                    
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
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        Enviar
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

export default ForgotPasswordForm;