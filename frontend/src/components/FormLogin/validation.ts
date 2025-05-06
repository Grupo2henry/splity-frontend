export const validation = {
    email: {
        required: "El correo electrónico es requerido",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "El email no es válido",
        },
    },
    password: {
        required: "La contraseña es requerida",
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
            message: "La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial",
        },
    },  
}; //