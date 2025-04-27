"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { IFormRegister } from "./types";
import CustomAlert, {useCustomAlert} from "../CustomAlert/CustomAlert";

export const FormRegister = () => {

    const { message, showAlert, onClose } = useCustomAlert();

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<IFormRegister>({mode: "onBlur"});

    const onSubmit: SubmitHandler<IFormRegister> = async (data) => {
        try {
            console.log(data);
            showAlert("Registration successful!");
        } catch (error) {
            console.error(error);
            showAlert("Registration failed!");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: "Name is required" })} type="text" placeholder="Nombre Completo" />
                {errors.name && <p className="error">{errors.name.message}</p>}
                <input {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } })} type="email" placeholder="Correo Electrónico" />
                {errors.email && <p className="error">{errors.email.message}</p>}
                <input {...register("username", { required: "Username is required" })} type="text" placeholder="Nombre de Usuario" />
                {errors.username && <p className="error">{errors.username.message}</p>}
                <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })} type="password" placeholder='Contraseña'/>
                {errors.password && <p className="error">{errors.password.message}</p>}
                <input {...register('confirmPassword', {required: true, validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden'})} type='password' placeholder='Confirmar Password'/>
                {errors.confirmPassword && <span className='text-red-500'>{errors.confirmPassword.message?.toString()}</span>}
                <button type="submit">Registrarse</button>
            </form>
            <CustomAlert message={message} onClose={onClose} />
        </>
    );
};

export default FormRegister;