"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormRegister } from "./types";
import CustomAlert, { useCustomAlert } from "../../CustomAlert/CustomAlert";
import Link from "next/link";
import { validation } from "./validation";
import { useAuth } from "@/context/AuthContext"; // Importa el AuthContext
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleLoginButton } from '@/components/Buttons/GoogleLoginButton/GoogleLoginButton';
import { EyeIcon } from '@/components/Icons/EyeIcon';
import styles from "./RegisterForm.module.css";

export const RegisterForm = () => {
  const router = useRouter();
  const { register: registerUser, loading, errors: authErrors } = useAuth(); // Obtén la función register y el estado de error del contexto
  const { message, showAlert, onClose } = useCustomAlert();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<IFormRegister>({ mode: "onBlur" });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const onSubmit: SubmitHandler<IFormRegister> = async (data) => {
    try {
      await registerUser(data); // Llama a la función de registro del contexto
      showAlert("¡Registro exitoso!");
      router.push('/Login');
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "Error en el registro";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      showAlert(errorMessage);
    }
  };

  // Mostrar errores del contexto de autenticación
  useEffect(() => {
    if (authErrors.length > 0) {
      showAlert(authErrors[0]); // Muestra el primer error del array
    }
  }, [authErrors, showAlert]);

  return (
    <>
      <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
          <h1 className={styles.title}>Crea tu cuenta</h1>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                {...register("name", validation.name)}
                type="text"
                placeholder="Nombre Completo"
                className={styles.input}
              />
              {errors.name && (
                <p className={styles.errorMessage}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                {...register("email", validation.email)}
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
                {...register("username", validation.username)}
                type="text"
                placeholder="Nombre de Usuario"
                className={styles.input}
              />
              {errors.username && (
                <p className={styles.errorMessage}>{errors.username.message}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                {...register("password", validation.password)}
                type={passwordVisible ? "text" : "password"}
                placeholder="Contraseña"
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
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <input
                {...register('confirm_password', {
                  required: "La confirmación de la contraseña es requerida",
                  validate: (value) => value === getValues("password") || "Las contraseñas no coinciden"
                })}
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirmar Contraseña"
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
              {errors.confirm_password && (
                <p className={styles.errorMessage}>{errors.confirm_password.message}</p>
              )}
            </div>
          </div>

          <p className={styles.termsText}>
            Al crear tu cuenta, aceptas nuestros términos y condiciones
          </p>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className={styles.divider}>o</div>

          <div className={styles.googleButtonWrapper}>
            <GoogleLoginButton />
          </div>

          <div className={styles.loginLink}>
            ¿Ya tienes una cuenta?{" "}
            <Link href="/Login">Ingresar</Link>
          </div>
        </form>
      </div>
      <CustomAlert message={message} onClose={onClose} />
    </>
  );
};

export default RegisterForm;