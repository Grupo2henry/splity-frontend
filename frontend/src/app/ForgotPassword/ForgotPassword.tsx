import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm/ForgotPasswordForm";
export const ForgotPassword = () => {
    return (
        <div>
            <p>Ingresa tu correo electronico para restablecer tu contraseña</p>
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPassword;