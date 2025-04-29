export const validation = {
    username: {
        required: "El nombre de usuario es requerido",
        pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
            message: "El nombre de usuario debe tener al menos 8 caracteres, una letra y un número",
        },
    },
    password: {
        required: "La contraseña es requerida",
        pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
            message: "La contraseña debe tener al menos 8 caracteres, una letra y un número",
        },
    },  
};