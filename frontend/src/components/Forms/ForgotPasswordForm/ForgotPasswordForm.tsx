"use client";

import {useForm, SubmitHandler} from "react-hook-form";
import {IFormForgotPassword} from "./types";
import { fetchForgotPassword } from "@/services/auth-services/fetchForgotPassword";
import CustomAlert, { useCustomAlert } from "@/components/CustomAlert/CustomAlert";
export const ForgotPasswordForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<IFormForgotPassword>({mode: "onBlur"});

    const { message, showAlert, onClose } = useCustomAlert();

    const onSubmit: SubmitHandler<IFormForgotPassword> = async (data) => {
        try {
            await fetchForgotPassword(data);
            showAlert("Se ha enviado un correo electrónico para restablecer la contraseña.", "./");
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
            <h1 className="text-2xl font-bold mb-4">Recuperar Contraseña</h1>
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
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Enviar</button>
            </form>
            <CustomAlert message={message} onClose={onClose} />
        </div>
    );
};

export default ForgotPasswordForm;