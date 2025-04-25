"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormLogin } from "./types";
import { validation } from "./validation";
import { useState } from "react";
import CustomAlert, { useCustomAlert } from "../CustomAlert/CustomAlert";

export const FormLogin = () => {
    const { message, showAlert, onClose } = useCustomAlert();

    const [passwordVisible, setPasswordVisible] = useState("password");    

    const { register, handleSubmit, formState: { errors } } = useForm<IFormLogin>({mode: "onBlur"});

    const togglePasswordVisibility = () => {
        setPasswordVisible(passwordVisible === "password" ? "text" : "password");
    };

    const onSubmit: SubmitHandler<IFormLogin> = async (data) => {
        try {
            console.log(data);
            showAlert("Login successful!");
        } catch (error) {
            console.error(error);
            showAlert("Login failed!");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("username", validation.username)} type="text" placeholder="Nombre de Usuario" />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                <div className='relative w-1/2'>
                    <input {...register('password', validation.password)} type={passwordVisible} placeholder='Contraseña'/>
                    <button type='button' className='absolute top-2 right-2' onClick={togglePasswordVisibility}>{passwordVisible === "password" ? "🔓" : "🔒"}</button>                    
                </div>
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button type="submit">Ingresar</button>
            </form>
            <CustomAlert message={message} onClose={onClose} />
        </>
    );
};

export default FormLogin;