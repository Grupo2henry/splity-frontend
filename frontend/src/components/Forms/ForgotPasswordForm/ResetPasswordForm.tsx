"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormResetPassword } from "./types";
import { fetchResetPassword } from "@/services/auth-services/fetchResetPassword";
import CustomAlert, { useCustomAlert } from "@/components/CustomAlert/CustomAlert";

export const ResetPasswordForm = () => {

    const {register, handleSubmit, formState: {errors}, getValues} = useForm<IFormResetPassword>({mode: "onBlur"});

    const { message, showAlert, onClose } = useCustomAlert();

    const onSubmit: SubmitHandler<IFormResetPassword> = async (data) => {
        try {
            await fetchResetPassword(data);
            showAlert("La contraseña ha sido restablecida con éxito", "./Login");
        } catch (error) {
            if (error instanceof Error) {
                showAlert(error.message);
            } else {
                showAlert("Error desconocido");
            }
        }
    };
    
    return (        
        <div>
            <h1 className="text-2xl font-bold mb-4">Restablecer Contraseña</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        {...register("email", {
                            required: "El correo electrónico es obligatorio",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "El formato del correo electrónico no es válido"
                            }
                        })}
                        type="email"
                        id="email"
                        className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input
                        {...register("newPassword", {
                            required: "La contraseña es obligatoria",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                                message: "La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial",
                            },
                        })}
                        type="password"
                        id="password"
                        className={`mt-1 block w-full p-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                    {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                    <input
                        {...register("confirmNewPassword", {
                            required: "La confirmación de la contraseña es obligatoria",
                            validate: (value) => value === getValues("newPassword") || "Las contraseñas no coinciden"
                        })}
                        type="password"
                        id="confirmPassword"
                        className={`mt-1 block w-full p-2 border ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                    {errors.confirmNewPassword && <p className="text-red-500">{errors.confirmNewPassword.message}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Enviar</button>
            </form>
            <CustomAlert message={message} onClose={onClose} />
        </div>
    );
};

export default ResetPasswordForm;