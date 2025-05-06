import { IFormLogin } from "@/components/FormLogin/types";

export const fetchLogin = async (data: IFormLogin) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        localStorage.setItem('token', result.access_token);
        console.log(localStorage.getItem('token'));
        return result;        
    } catch (error) {
        return Promise.reject(error);
    }
};

export default fetchLogin;
