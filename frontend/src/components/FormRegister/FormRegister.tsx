"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormRegister } from "./types";
import CustomAlert, {useCustomAlert} from "../CustomAlert/CustomAlert";
import Link from "next/link";
import { validation } from "./validation";
import fetchRegister from "@/services/fetchRegister";

export const FormRegister = () => {

    const { message, showAlert, onClose } = useCustomAlert();

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<IFormRegister>({mode: "onBlur"});

    const onSubmit: SubmitHandler<IFormRegister> = async (data) => {
        try {
            console.log(data);
            await fetchRegister(data);
            showAlert("Registration successful!");
        } catch (error) {
            console.error(error);
            showAlert("Registration failed!");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <h1 className="text-[24px] text-center text-[#FFFFFF] mb-4">Crea tu cuenta</h1>
                <div className="flex flex-col w-full gap-2 mb-2 rounded-lg bg-[#61587C] p-2">
                    <input {...register("name", validation.name)} type="text" placeholder="Nombre Completo" className="custom-input"/>
                    {errors.name && <p className="text-amber-50 text-[0.75rem]">{errors.name.message}</p>}
                    <input {...register("email", validation.email)} type="email" placeholder="Correo Electrónico" className="custom-input" />
                    {errors.email && <p className="text-amber-50 text-[0.75rem]">{errors.email.message}</p>}
                    <input {...register("username", validation.username)} type="text" placeholder="Nombre de Usuario" className="custom-input"/>
                    {errors.username && <p className="text-amber-50 text-[0.75rem]">{errors.username.message}</p>}
                    <input {...register("password", validation.password)} type="password" placeholder="Contraseña" className="custom-input"/>
                    {errors.password && <p className="text-amber-50 text-[0.75rem]">{errors.password.message}</p>}
                    <input {...register('confirmPassword', 
                        {required: "La confirmación de la contraseña es requerida", validate: (value) => value === getValues("password") || "Las contraseñas no coinciden"})} 
                        type="password" placeholder="Confirmar Password" className="custom-input"/>
                    {errors.confirmPassword && <p className='text-amber-50 text-[0.75rem]'>{errors.confirmPassword.message}</p>}
                </div>
                <h2 className="text-left text-[#FAFF00] mb-4">Al crear tu cuenta, aceptas nuestros términos y condiciones</h2>
                <div className="flex flex-col items-center justify-center">
                    <button type="submit" className="btn-yellow text-[24px] mt-4">Registrarse</button>                    
                    <h2 className="text-[#FAFF00] mt-6">¿Ya tienes una cuenta? <Link href="/Login" className="text-[#FAFF00] font-bold">Ingresar</Link></h2>
                </div>
            </form>
            <CustomAlert message={message} onClose={onClose} />
        </>
    );
};

export default FormRegister;