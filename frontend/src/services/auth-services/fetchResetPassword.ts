import { IFormResetPassword } from "@/components/Forms/ForgotPasswordForm/types";

export const fetchResetPassword = async (data: IFormResetPassword) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password/`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    return await response.json();
};

export default fetchResetPassword;