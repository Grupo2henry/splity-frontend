import { IFormForgotPassword } from "@/components/Forms/ForgotPasswordForm/types";

export const fetchForgotPassword = async (data: IFormForgotPassword) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    return await response.json();
};