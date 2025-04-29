import { IFormRegister } from "@/components/FormRegister/types"; 

export const fetchRegister = async (data: IFormRegister) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;            
    } catch (error) {
        return Promise.reject(error);
    }
};

export default fetchRegister;