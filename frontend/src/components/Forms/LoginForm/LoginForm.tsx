"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormLogin } from "./types";
import { validation } from "./validation";
import { useState } from "react";
import CustomAlert, { useCustomAlert } from "../../CustomAlert/CustomAlert";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const LoginForm = () => {
  const { login, loading, errors } = useAuth();
  const { message, showAlert, onClose } = useCustomAlert();
  const [passwordVisible, setPasswordVisible] = useState("password");

  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<IFormLogin>({ mode: "onBlur" });

  const togglePasswordVisibility = () => {
    setPasswordVisible(passwordVisible === "password" ? "text" : "password");
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <h1 className="text-[24px] text-center text-[#FFFFFF] mb-10">Ingresa para continuar</h1>
        <div className="flex flex-col w-full gap-2 mb-2 rounded-lg bg-[#61587C] p-2">
          <input {...register("email", validation.email)} type="text" placeholder="Correo Electrónica" className="custom-input" />
          {formErrors.email && <p className="text-amber-50 text-[0.75rem]">{formErrors.email.message}</p>}
          <div className='relative'>
            <input {...register('password', validation.password)} type={passwordVisible} placeholder='Contraseña' className='custom-input' />
            <button type='button' className='absolute top-2 right-2' onClick={togglePasswordVisibility}>{passwordVisible === "password" ? "🔓" : "🔒"}</button>
          </div>
          {formErrors.password && <p className="text-amber-50 text-[0.75rem]">{formErrors.password.message}</p>}
        </div>
        <h2 className="text-right text-[#FAFF00] mb-4">¿Olvidaste tu contraseña?</h2>
        <div className="flex flex-col items-center justify-center">
          <button type="submit" className="btn-yellow text-[24px] mt-4" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <h2 className="text-[#FAFF00] mt-6">¿No tienes una cuenta? <Link href="/Register" className="text-[#FAFF00] font-bold">Registrarse</Link></h2>
        </div>
      </form>
      <CustomAlert message={message} onClose={onClose} />
    </>
  );
};

export default LoginForm;