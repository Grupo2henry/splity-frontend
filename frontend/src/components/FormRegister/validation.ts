export const validation = {
    email: {
        required: "El email es requerido",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "El email no es válido",
        },
    },  
    name: {
        required: "El nombre y el apellido es requerido",
        pattern: {
            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/,
            message: "El nombre y el apellido no son válidos",
        },
    },
    username: {
        required: "El nombre de usuario es requerido",
        pattern: {
            value: /^[A-Za-z0-9_]+$/,
            message: "El nombre de usuario no es válido",
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