export interface IFormForgotPassword {
    email: string;
};

export interface IFormResetPassword {
    email: string;
    newPassword: string;
    confirmNewPassword: string;
};