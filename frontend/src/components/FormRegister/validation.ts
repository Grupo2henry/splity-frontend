export const validation = {
    email: {
        required: "El email es requerido",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "El email no es válido",
        },
    },  
    name: {
        required: "El nombre y el apellido es requerido",
        pattern: {
            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' -]+$/,
            message: "El nombre y el apellido no son válidos",
        },
    },
    username: {
        required: "El nombre de usuario es requerido",
        pattern: {
            value: /^[a-zA-Z0-9._]{3,30}$/,
            message: "El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos y guiones bajos",
        },
    },
    password: {
        required: "La contraseña es requerida",
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
            message: "La contraseña debe tener al menos 8 caracteres, una letra, un número y un carácter especial",
        },
    },
};