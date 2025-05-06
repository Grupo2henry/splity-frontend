import { useState } from "react";
import { useRouter } from "next/navigation";

interface CustomAlertProps {
    message: string;
    onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="custom-alert">
            <div className="alert-box">
                <p>{message}</p>
                <button onClick={onClose} className="botonAzul">Cerrar</button>
            </div>
        </div>
    );
};

export const useCustomAlert = () => {

    const [message, setMessage] = useState<string>("");
    const [redirectPath, setRedirectPath] = useState<string | null>(null);
    const [callback, setCallback] = useState<(() => void) | null>(null);
    const [isAlertClosed, setIsAlertClosed] = useState<boolean>(false);
    const router = useRouter();

    const showAlert = (message: string, path?: string, callback?: () => void) => {
        setMessage(message);
        setRedirectPath(path || null);
        setCallback(callback || null);
        setIsAlertClosed(false);
    };

    const onClose = () => {
        setMessage("");
        setIsAlertClosed(true);
        if (redirectPath) router.push(redirectPath);
        if (callback) callback();
        setCallback(null);
        setRedirectPath(null);
    };

    return { message, showAlert, onClose, isAlertClosed };
};

export default CustomAlert;
