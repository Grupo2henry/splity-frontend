"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormLogin } from "./types";
import { validation } from "./validation";
import { useState } from "react";
import CustomAlert, { useCustomAlert } from "../../CustomAlert/CustomAlert";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GoogleLoginButton } from '@/components/Buttons/GoogleLoginButton/GoogleLoginButton';
import { EyeIcon } from '@/components/Icons/EyeIcon';
import styles from "./LoginForm.module.css";

export const LoginForm = () => {
  const { login, loading, errors } = useAuth();
  const { message, showAlert, onClose } = useCustomAlert();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<IFormLogin>({ mode: "onBlur" });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit: SubmitHandler<IFormLogin> = async (data) => {
    await login(data);
    if (errors.length > 0) {
      showAlert(errors.join(", "));
    } else if (!loading) {
      showAlert("Login successful!", "/Dashboard");
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
          <h1 className={styles.title}>Iniciar Sesion</h1>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <input
                {...register("email", validation.email)}
                type="text"
                placeholder="Correo Electrónico"
                className={styles.input}
              />
              {formErrors.email && (
                <p className={styles.errorMessage}>{formErrors.email.message}</p>
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
              {formErrors.password && (
                <p className={styles.errorMessage}>{formErrors.password.message}</p>
              )}
            </div>
          </div>

          <Link href="/ForgotPassword" className={styles.forgotPassword}>
            ¿Olvidaste tu contraseña?
          </Link>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className={styles.divider}>o</div>

          <div className={styles.googleButtonWrapper}>
            <GoogleLoginButton />
          </div>

          <div className={styles.registerLink}>
            ¿No tienes una cuenta?{" "}
            <Link href="/Register">Registrarse</Link>
          </div>
        </form>
      </div>
      <CustomAlert message={message} onClose={onClose} />
    </>
  );
};

export default LoginForm;